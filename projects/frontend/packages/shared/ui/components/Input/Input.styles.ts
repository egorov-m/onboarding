import styled from "styled-components";

export const InputField = styled.input`
  width: 100%;
  padding: 10px;
  font-size: 14px;
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 4px;
  margin-top: 10px;
  background-color: ${({ theme }) => theme.bodyBackground};
  color: ${({ theme }) => theme.textColor};
`;
