import React, { FC } from 'react';
import * as styles from './TableProjects.styles';
import { StarRating } from '../StarRating/StarRating';

interface RowData {
  name: string;
  lastEdited: string;
  status: "Published" | "Saved";
  rating: number;
}

interface TableProjectsProps {
  data: RowData[];
}

export const TableProjects: FC<TableProjectsProps> = ({ data }) => (
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
      {data.map((row, index) => (
        <tr key={index}>
          <styles.NameColumn>{row.name}</styles.NameColumn>
          <td>{row.lastEdited}</td>
          <td><StarRating rating={row.rating} /></td> 
          <td>
            <styles.Status status={row.status}>{row.status}</styles.Status>
          </td>
        </tr>
      ))}
    </tbody>
  </styles.StyledTable>
);