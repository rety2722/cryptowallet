require("dotenv").config();
import { Request, response, Response } from "express";
import {
  TransactionSchema,
  ReplyTransactionSchema,
  InputTransactionSchema,
  ResponseTransactionSchema,
} from "./tx.schema";
import axios from "axios";
import TagModel from "./model";

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

export const getTransactions = async (
  req: Request<InputTransactionSchema, {}>,
  res: Response
) => {
  try {
    const ownerId = req.query.ownerId || "";
    const walletId = req.query.walletId;
    const limit = Number(req.query.limit) || 15;

    const transactions = await axios
      .get(
        `https://api.etherscan.io/api?module=logs&action=getLogs&address=${walletId}&page=1&apikey=${ETHERSCAN_API_KEY}`
      )
      .then(async (response): Promise<TransactionSchema[]> => {
        let result: TransactionSchema[] = [];
        let arr = (response.data.result as ResponseTransactionSchema[]).slice(
          0,
          limit
        );
        for (let i = 0; i < arr.length; i++) {
          let tx_data = await axios
            .get(
              `https://api.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=${arr[i].transactionHash}&apikey=${ETHERSCAN_API_KEY}`
            )
            .then((response) => {
              return response.data.result;
            });
          if (
            result.length > 0 &&
            result[result.length - 1].hash === tx_data.hash
          ) {
            continue;
          }

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

          result.push(tx_data);
        }
        return result;
      });
    res.status(200).json({
      status: "success",
      data: {
        transactions: transactions,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
