import React from "react";

import * as styles from "./Button.styles";

interface ButtonProps {
  type?: "primary" | "secondary" | "danger";
  onClick: () => void;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  type = "primary",
  onClick,
  children,
}) => (
  <styles.StyledButton type={type} onClick={onClick}>
    {children}
  </styles.StyledButton>
);
