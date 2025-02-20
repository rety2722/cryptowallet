import React, { useState, useEffect } from "react";
import axios from "axios";
import "./manageTagsModal.css"; // Import the CSS file for styling
import { truncate } from "../../../utils";

interface TagEntry {
  walletId: string;
  tag: string;
}

interface ManageTagsModalProps {
  address: string;
  onClose: () => void;
}

const ManageTagsModal: React.FC<ManageTagsModalProps> = ({
  address,
  onClose,
}) => {
  const [entries, setEntries] = useState<TagEntry[]>([]);
  const [newAddress, setNewAddress] = useState("");
  const [newTag, setNewTag] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentRecords, setCurrentRecords] = useState<TagEntry[]>([]);
  const recordsPerPage = 5;

  useEffect(() => {
    // Fetch tags from server when component mounts
    const fetchTags = async () => {
      try {
        console.log("Fetching tags for address:", address);
        const response = await axios
          .get(`http://localhost:8080/api/tags?ownerId=${address}`)
          .then((res) => {
            return res.data.tags;
          });
        setEntries(response);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    fetchTags();
  }, []);

  const handleAddEntry = () => {
    try {
      axios.post(
        `${
          import.meta.env.VITE_BASE_SERVER_URL
        }/tags?ownerId=${address}&walletId=${newAddress}&tag=${newTag}`
      );
      setEntries([...entries, { walletId: newAddress, tag: newTag }]);
      setNewAddress("");
      setNewTag("");
    } catch (error: any) {
      console.error("Error adding tag:", error);
    }
  };

  const handleRemoveEntry = (index: number) => {
    try {
      axios.delete(
        `${
          import.meta.env.VITE_BASE_SERVER_URL
        }/tags?ownerId=${address}&walletId=${entries[index].walletId}`
      );
      const updatedEntries = entries.filter((_, i) => i !== index);
      setEntries(updatedEntries);
    } catch (error: any) {
      console.error("Error removing tag:", error);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const newRecords = [];
    for (let i = indexOfFirstRecord; i < indexOfLastRecord; i++) {
      if (i >= entries.length) {
        break;
      }
      newRecords.push(entries[i]);
    }
    setCurrentRecords(newRecords);
  }, [entries, currentPage]);

  const totalPages = Math.ceil(entries.length / recordsPerPage);

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

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>Manage Tags</h2>
        <table className="tags-table">
          <thead>
            <tr>
              <th>Address</th>
              <th>Tag</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.map((entry, index) => (
              <tr key={index}>
                <td>{truncate(entry.walletId, 10)}</td>
                <td>{entry.tag}</td>
                <td className="actions-cell">
                  <button onClick={() => handleRemoveEntry(index)}>-</button>
                </td>
              </tr>
            ))}
            <tr>
              <td>
                <input
                  type="text"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder="New Address"
                />
              </td>
              <td>
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="New Tag"
                />
              </td>
              <td className="actions-cell">
                <button onClick={handleAddEntry}>Add</button>
              </td>
            </tr>
          </tbody>
        </table>
        <div className="pagination">
          <button onClick={handlePreviousPage} disabled={currentPage === 1}>
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageTagsModal;
