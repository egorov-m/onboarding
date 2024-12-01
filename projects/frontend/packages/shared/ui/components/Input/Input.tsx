import React from "react";

import * as styles from "./Input.styles";

interface InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}

export const Input: React.FC<InputProps> = ({
  value,
  onChange,
  placeholder,
}) => (
  <styles.InputField
    value={value}
    onChange={onChange}
    placeholder={placeholder}
  />
);
