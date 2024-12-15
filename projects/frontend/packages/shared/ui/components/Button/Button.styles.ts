import styled from "styled-components";

export interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

export const StyledButton = styled.button<ButtonProps>`
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  border: none;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.buttonBackground};
  color: ${({ theme }) => theme.buttonTextColor};

  &:hover {
    background-color: ${({ theme }) => theme.buttonHoverBackground};
  }
`;
