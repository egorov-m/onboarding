import React, { FC } from "react";
import * as styles from "./TableProjects.styles";
import { StarRating } from "../StarRating/StarRating";
import { useNavigate } from "react-router";

interface RowData {
  id: string;
  name: string;
  updated_at: string;
  status: "published" | "unpublished";
  average_rating: number;
}

interface TableProjectsProps {
  data: RowData[];
}

export const TableProjects: FC<TableProjectsProps> = ({ data }) => {
  const navigate = useNavigate();

  const handleRowClick = (row: RowData) => {
    navigate(
      `${process.env.REACT_APP_SERVER_PATH_PREFIX}/constructor/${row.id}`,
      {
        state: { name: row.name, status: row.status },
      }
    );
  };

  return (
    <styles.StyledTable>
      <thead>
        <tr>
          <th>Name</th>
          <th>Last Edited</th>
          <th>Rating</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.id} onClick={() => handleRowClick(row)}>
            <styles.NameColumn>{row.name}</styles.NameColumn>
            <td>{row.updated_at}</td>
            <td>
              <StarRating rating={row.average_rating} />
            </td>
            <td>
              <styles.Status status={row.status}>{row.status}</styles.Status>
            </td>
          </tr>
        ))}
      </tbody>
    </styles.StyledTable>
  );
};
