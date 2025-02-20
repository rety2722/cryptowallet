import React, { useState, useEffect } from "react";
import "./txTable.css"; // Import the CSS file for styling
import TxCell from "./txCell";
import PageNavigation from "./PageNavigation/pageNavigation";

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
}

interface TransactionTableProps {
  transactions: Transaction[];
}

export const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [modalContent, setModalContent] = useState<string | null>(null);
  const [currentRecords, setCurrentRecords] = useState<Transaction[]>([]);
  const recordsPerPage = 10;

  useEffect(() => {
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const newRecords: Transaction[] = [];
    for (let i = indexOfFirstRecord; i < indexOfLastRecord; i++) {
      if (i >= transactions.length) {
        break;
      }
      // assume server sends different transactions
      newRecords.push(transactions[i]);
    }
    console.log("New Records:", newRecords);
    setCurrentRecords(newRecords);
  }, [transactions, currentPage]);

  const totalPages = Math.ceil(transactions.length / recordsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleCellClick = (content: string) => {
    setModalContent(content);
  };

  const closeModal = () => {
    setModalContent(null);
  };

  const emptyRows = recordsPerPage - currentRecords.length;

  return (
    <div className="transaction-table-container">
      <div className="table-wrapper">
        <table className="transaction-table">
          <thead>
            <tr>
              <th>Hash</th>
              <th>From</th>
              <th>To</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.map((transaction) => (
              <tr
                key={typeof transaction === "undefined" ? "" : transaction.hash}
              >
                <TxCell
                  content={transaction.hash}
                  onClick={() => handleCellClick(transaction.hash)}
                />
                <TxCell
                  content={transaction.from}
                  onClick={() => handleCellClick(transaction.from)}
                />
                <TxCell
                  content={transaction.to}
                  onClick={() => handleCellClick(transaction.to)}
                />
                <TxCell
                  content={transaction.value}
                  onClick={() => handleCellClick(transaction.value)}
                />
              </tr>
            ))}
            {Array.from({ length: emptyRows }).map((_, index) => (
              <tr key={`empty-${index}`}>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <PageNavigation
        currentPage={currentPage}
        totalPages={totalPages}
        onPreviousPage={handlePreviousPage}
        onNextPage={handleNextPage}
      />
      {modalContent && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <p>{modalContent}</p>
          </div>
        </div>
      )}
    </div>
  );
};
