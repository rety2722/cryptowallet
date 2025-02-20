import React from "react";
import { truncate } from "../../utils";

interface TxCellProps {
  content: string | null;
  onClick: () => void;
}

const TxCell: React.FC<TxCellProps> = ({ content, onClick }) => {
  return <td onClick={onClick}>{truncate(content ? content : "", 10)}</td>;
};

export default TxCell;
