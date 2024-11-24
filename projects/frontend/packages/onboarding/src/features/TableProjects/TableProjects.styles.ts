import styled from "styled-components";

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;

  cursor: pointer;

  table-layout: fixed;

  th,
  td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }

  th {
    font-size: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  td {
    font-size: 0.9rem;
  }

  tbody tr:hover {
    background-color: #f5f5f5;
  }
`;

export const Status = styled.span<{ status: "published" | "unpublished" }>`
  color: ${({ status }) => (status === "published" ? "green" : "#c4c400")};
`;

export const NameColumn = styled.td`
  width: 200px;
  word-wrap: break-word;
  white-space: normal;
  overflow-wrap: break-word;
`;
