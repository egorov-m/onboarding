import styled from 'styled-components';

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  font-family: 'Montserrat', sans-serif;

  cursor: pointer;

  table-layout: fixed;

  th, td {
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

export const Status = styled.span<{ status: 'Published' | 'Saved' }>`
  color: ${({ status }) => (status === 'Published' ? 'green' : '#c4c400')};
`;

export const NameColumn = styled.td`
  width: 200px; 
  word-wrap: break-word;
  white-space: normal;
  overflow-wrap: break-word;
`;