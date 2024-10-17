import React, { FC } from 'react';
import * as styles from './TableProjects.styles';
import { StarRating } from '../StarRating/StarRating';

interface RowData {
  id: string;
  name: string;
  updated_at: string;
  status: "Published" | "Saved";
  average_rating: number;
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
      {data.map((row) => (
        <tr key={row.id}>
          <styles.NameColumn>{row.name}</styles.NameColumn>
          <td>{row.updated_at}</td>
          <td><StarRating rating={row.average_rating} /></td> 
          <td>
            <styles.Status status={row.status}>{row.status}</styles.Status>
          </td>
        </tr>
      ))}
    </tbody>
  </styles.StyledTable>
);