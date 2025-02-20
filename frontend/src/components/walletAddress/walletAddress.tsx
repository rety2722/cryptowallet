import React, { useState, useEffect } from "react";
import "./walletAddress.css";
import { Transaction } from "../transactionTable/txTable";
import axios from "axios";

interface WalletAddressProps {
  address: string;
  setTransactions: (transactions: Transaction[]) => void;
}

const WalletAddress: React.FC<WalletAddressProps> = ({
  address,
  setTransactions,
}) => {
  const [warning, setWarning] = useState("");
  const [walletAddress, setWalletAddress] = useState("");

  const handleUseMyAddress = () => {
    if (address) {
      setWalletAddress(address);
      setWarning("");
    } else {
      setWarning("User is not registered.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let response = await axios.get(
        `${
          import.meta.env.VITE_BASE_SERVER_URL
        }/tags/transactions?walletId=${walletAddress}&ownerId=${address}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data: Transaction[] = response.data.data.transactions;
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  useEffect(() => {
    if (warning) {
      const timer = setTimeout(() => {
        setWarning("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [warning]);

  return (
    <form className="wallet-input" onSubmit={handleSubmit}>
      <div className="input-group">
        <input
          type="text"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
          placeholder="Enter wallet address"
        />
        <button type="button" onClick={handleUseMyAddress}>
          Use My Address
        </button>
        <button type="submit">Send</button>
      </div>
      <div className="warning">{warning}</div>
    </form>
  );
};

export default WalletAddress;
