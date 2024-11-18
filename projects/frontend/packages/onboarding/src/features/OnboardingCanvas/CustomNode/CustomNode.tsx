import React from "react";
import { Handle, Position } from "react-flow-renderer";

interface CustomNodeData {
  label: string;
  id: string;
  onAddStep: (id: string) => void;
  onDelete: () => void;
  onClick: () => void;
  board_step_id?: string;
  blob_id?: string;
}

export const CustomNode: React.FC<{ data: CustomNodeData }> = ({ data }) => {
  return (
    <div
      style={{
        padding: "10px",
        border: "1px solid #222",
        borderRadius: "5px",
        backgroundColor: "#fff",
        position: "relative",
        cursor: "pointer",
      }}
      onClick={data.onClick}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            data.onDelete();
          }}
          style={{
            backgroundColor: "white",
            border: "none",
            color: "red",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          -
        </button>

        <strong style={{ margin: "0 10px" }}>{data.label}</strong>

        <button
          onClick={(e) => {
            e.stopPropagation();
            data.onAddStep(data.id);
          }}
          style={{
            backgroundColor: "white",
            color: "green",
            cursor: "pointer",
            border: "none",
            fontSize: "14px",
          }}
        >
          +
        </button>
      </div>

      <Handle type='source' position={Position.Right} id='a' />
      <Handle type='target' position={Position.Left} id='b' />
    </div>
  );
};
