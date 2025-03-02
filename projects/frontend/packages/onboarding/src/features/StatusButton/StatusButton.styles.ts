import styled from "styled-components";

interface ButtonProps {
  status: "published" | "unpublished";
}

export const Button = styled.button<ButtonProps>`
  padding: 10px 15px;
  background-color: ${({ status }) =>
    status === "published" ? "#28a745" : "#ffc107"};
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-left: auto;

  &:hover {
    background-color: ${({ status }) =>
      status === "published" ? "#218838" : "#e0a800"};
  }
`;
