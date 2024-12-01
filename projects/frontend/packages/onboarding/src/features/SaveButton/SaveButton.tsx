import React from "react";

import * as styles from "./SaveButton.styles";
import { useNavigate } from "react-router";

interface SaveButtonProps {
  onClick: () => void;
}

export const SaveButton: React.FC<SaveButtonProps> = ({ onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    onClick();
    navigate(`${process.env.ONBOARDING_WEB_APP_PATH_PREFIX}/projects`);
  };

  return <styles.Button onClick={handleClick}>Сохранить</styles.Button>;
};
