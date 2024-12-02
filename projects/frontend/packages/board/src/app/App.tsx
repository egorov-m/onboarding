import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { lightTheme } from "shared/constants/Themes";
import { BoardPage } from "../pages/BoardPage/BoardPage";

import GlobalStyles from "shared/ui/GlobalStyles";

function App() {
  const router = createBrowserRouter([
    {
      path: `${process.env.BOARD_WEB_APP_PATH_PREFIX}/:boardId`,
      element: <BoardPage />,
    },
  ]);
  return (
    <ThemeProvider theme={lightTheme}>
      <GlobalStyles disableScroll />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
