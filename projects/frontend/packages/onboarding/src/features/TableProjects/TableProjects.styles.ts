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
    background-color: ${({ theme }) => theme.hoverBg};
  }
`;

export const Status = styled.span<{ status: "published" | "unpublished" }>`
  color: ${({ status, theme }) =>
    status === "published" ? theme.statusPublished : theme.statusUnpublished};
`;

export const NameColumn = styled.td`
  width: 200px;
  word-wrap: break-word;
  white-space: normal;
  overflow-wrap: break-word;
`;

export const IconContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 36px;
  margin-left: 8px;
`;

export const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: flex-start;
`;
