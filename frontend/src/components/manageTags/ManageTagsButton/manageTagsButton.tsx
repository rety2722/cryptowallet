import React, { useState } from "react";
import "./ManageTagsButton.css"; // Import the CSS file for styling
import ManageTagsModal from "../FloatingTable/manageTagsModal"; // Import the modal component

interface ManageTagsButtonProps {
  address: string;
}

const ManageTagsButton: React.FC<ManageTagsButtonProps> = ({ address }) => {
  const [showModal, setShowModal] = useState(false);

  const handleButtonClick = () => {
    if (address && address != "") {
      setShowModal(true);
    } else {
      alert("Only registered users can use tags");
    }
    // setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <button className="manage-tags-button" onClick={handleButtonClick}>
        Manage Tags
      </button>
      {showModal && (
        <ManageTagsModal address={address} onClose={handleCloseModal} />
      )}
    </>
  );
};

export default ManageTagsButton;
