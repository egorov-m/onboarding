import React from "react";
import { Board } from "../feature/Board/Board";
import { ThemeProvider } from "styled-components";
import { lightTheme } from "shared/constants/Themes";

import GlobalStyles from "shared/ui/GlobalStyles";

function App() {
  const steps = [
    {
      title: "Шаг 1: Начало",
      description: "Это описание первого шага.",
      image: "https://via.placeholder.com/600x300",
    },
    {
      title: "Шаг 2: Продолжение",
      description: "Описание второго шага.",
      image: "https://via.placeholder.com/600x300",
    },
    {
      title: "Шаг 3: Завершение",
      description: "Описание третьего шага.",
      image: "https://via.placeholder.com/600x300",
    },
  ];

  return (
    <ThemeProvider theme={lightTheme}>
      <GlobalStyles disableScroll />
      <Board steps={steps} />
    </ThemeProvider>
  );
}

export default App;
