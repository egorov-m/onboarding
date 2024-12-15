import React from "react";
import { Handle, Position } from "react-flow-renderer";

import * as styles from "./CustomNode.styles";

interface CustomNodeData {
  label: string;
  id: string;
  isLastNode: boolean;
  isFirstNode: boolean;
  onAddStep: (id: string) => void;
  onDelete: () => void;
  onClick: () => void;
  board_step_id?: string;
  blob_id?: string;
}

export const CustomNode: React.FC<{ data: CustomNodeData }> = ({ data }) => {
  return (
    <styles.NodeContainer onClick={data.onClick}>
      <styles.NodeHeader>
        {data.isLastNode && !data.isFirstNode && (
          <styles.Button
            color='red'
            onClick={(e) => {
              e.stopPropagation();
              data.onDelete();
            }}
          >
            -
          </styles.Button>
        )}

        <strong>{data.label}</strong>

        {data.isLastNode && (
          <styles.Button
            color='green'
            onClick={(e) => {
              e.stopPropagation();
              data.onAddStep(data.id);
            }}
          >
            +
          </styles.Button>
        )}
      </styles.NodeHeader>

      <Handle type='source' position={Position.Right} id='a' />
      <Handle type='target' position={Position.Left} id='b' />
    </styles.NodeContainer>
  );
};
