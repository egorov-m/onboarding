import React from "react";

import * as styles from "./Button.styles";

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ onClick, children }) => (
  <styles.StyledButton onClick={onClick}>{children}</styles.StyledButton>
);
