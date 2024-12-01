import styled from "styled-components";

export interface ButtonProps {
  type?: "primary" | "secondary" | "danger";
  onClick: () => void;
  children: React.ReactNode;
}

export const StyledButton = styled.button<ButtonProps>`
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  border: none;
  border-radius: 4px;
  background-color: ${({ type }) => {
    switch (type) {
      case "primary":
        return "#007bff";
      case "secondary":
        return "#6c757d";
      case "danger":
        return "#dc3545";
      default:
        return "#007bff";
    }
  }};
  color: white;
`;
