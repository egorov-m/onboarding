import styled from "styled-components";

interface ButtonProps {
  status: "Published" | "Saved";
}

export const Button = styled.button<ButtonProps>`
  font-family: "Montserrat", sans-serif;
  padding: 10px 15px;
  background-color: ${({ status }) =>
    status === "Published" ? "#28a745" : "#ffc107"};
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-left: auto;

  &:hover {
    background-color: ${({ status }) =>
      status === "Published" ? "#218838" : "#e0a800"};
  }
`;
