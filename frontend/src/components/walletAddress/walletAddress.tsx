import React, { useState, useEffect } from "react";
import "./walletAddress.css";
import { Transaction } from "../transactionTable/txTable";
import axios from "axios";

interface WalletAddressProps {
  address: string | undefined;
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
      setWarning(""); // Clear any existing warning
    } else {
      setWarning("User is not registered.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("Wallet Address:", walletAddress);

      let response = await axios.get(
        `http://localhost:8080/api/tags/transactions?walletId=${walletAddress}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data: Transaction[] = response.data.data.transactions;
      console.log("Fetched Transactions:", data);
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  useEffect(() => {
    if (warning) {
      const timer = setTimeout(() => {
        setWarning("");
      }, 3000); // Warning disappears after 3 seconds
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
