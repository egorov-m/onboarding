import React from "react";
import { Handle, Position } from "react-flow-renderer";

interface CustomNodeData {
  label: string;
  onAddStep: (id: string) => void;
  onClick: () => void;
}

export const CustomNode: React.FC<{ data: CustomNodeData }> = ({ data }) => {
  return (
    <div>
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
        <strong>{data.label}</strong>
        <Handle type='source' position={Position.Right} id='a' />
        <Handle type='target' position={Position.Left} id='b' />
        <button
          onClick={(e) => {
            e.stopPropagation();
            data.onAddStep(data.label.split(" ")[0]);
          }}
        >
          +
        </button>
      </div>
    </div>
  );
};
