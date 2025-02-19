import React, { useState, useEffect } from "react";
import "./txTable.css"; // Import the CSS file for styling

export interface Transaction {
  key: string;
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
      if (i > 0 && transactions[i].hash === transactions[i - 1].hash) {
        continue;
      }
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

  const truncate = (str: string, n: number) => {
    str = str || "";
    return str.length > n ? str.substr(0, n) + "..." : str;
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
                key={typeof transaction === "undefined" ? "" : transaction.key}
              >
                <td onClick={() => handleCellClick(transaction.hash)}>
                  {truncate(
                    typeof transaction === "undefined" ? "" : transaction.hash,
                    10
                  )}
                </td>
                <td onClick={() => handleCellClick(transaction.from)}>
                  {truncate(
                    typeof transaction === "undefined" ? "" : transaction.from,
                    10
                  )}
                </td>
                <td onClick={() => handleCellClick(transaction.to)}>
                  {truncate(
                    typeof transaction === "undefined" ? "" : transaction.to,
                    10
                  )}
                </td>
                <td onClick={() => handleCellClick(transaction.value)}>
                  {truncate(
                    typeof transaction === "undefined" ? "" : transaction.value,
                    10
                  )}
                </td>
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
      <div className="pagination">
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
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
