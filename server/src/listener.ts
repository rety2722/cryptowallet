import WebSocket from "ws";
import axios from "axios";
import TagModel from "./models/tagModel";

const INFURA_URL = process.env.INFURA_URL;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const ETHERSCAN_BASE_URL = process.env.ETHERSCAN_BASE_URL;

const { Web3 } = require("web3");
const web3 = new Web3(INFURA_URL);

export const handleMessage = async (
  ws: WebSocket,
  message: { walletId: string; ownerId: string }
) => {
  const walletId = message.walletId;
  const ownerId = message.ownerId;
  console.log("Connected to client!");

  console.log("Subscribing to logs...");
  const sub = await web3.eth.subscribe("logs", { address: walletId });

  sub.on("data", async function (blockHeader: any) {
    console.log("Block Header: ", blockHeader);
    const tx_data = await axios
      .get(
        `${ETHERSCAN_BASE_URL}?module=proxy&action=eth_getTransactionByHash&txhash=${blockHeader.transactionHash}&apikey=${ETHERSCAN_API_KEY}`
      )
      .then((response) => {
        return response.data.result;
      });

    const tx_dataTagFrom: string | null = await TagModel.findOne({
      where: {
        walletId: tx_data.from,
        ownerId: ownerId,
      },
    }).then((res) => {
      return res ? res.getDataValue("tag") : null;
    });
    if (tx_dataTagFrom !== null) {
      tx_data.from = tx_dataTagFrom;
    }

    const tx_dataTagTo: string | null = await TagModel.findOne({
      where: {
        walletId: tx_data.to,
        ownerId: ownerId,
      },
    }).then((res) => {
      return res ? res.getDataValue("tag") : null;
    });
    if (tx_dataTagTo !== null) {
      tx_data.to = tx_dataTagTo;
    }

    console.log("Tx Data sent: ", tx_data);
    ws.send(tx_data);
  });

  console.log("Received message:", message);
};

export const handleDisconnect = (ws: WebSocket) => {
  web3.eth.clearSubscriptions();
  console.log("Disconnected from client!");
};
