import styled from "styled-components";

export const NodeContainer = styled.div`
  padding: 10px;
  border: 1px solid ${({ theme }) => theme.nodeBorder};
  border-radius: 5px;
  background-color: ${({ theme }) => theme.nodeBackground};
  color: ${({ theme }) => theme.nodeTextColor};
  position: relative;
  cursor: pointer;
`;

export const NodeHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Button = styled.button<{ color: string }>`
  background-color: ${({ theme }) => theme.nodeBackground};
  color: ${({ color }) => color};
  border: none;
  cursor: pointer;
  font-size: 14px;
  padding: 0 5px;
`;
