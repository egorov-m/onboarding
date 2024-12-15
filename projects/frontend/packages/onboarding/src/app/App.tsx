import { useState } from "react";
import { Outlet } from "react-router";
import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "shared/constants/Themes";
import { ToastContainer } from "react-toastify";
import { Navbar, CanvasBackground, navLinks } from "@features";
import GlobalStyles from "shared/ui/GlobalStyles";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const currentTheme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={currentTheme}>
      <GlobalStyles />
      <div>
        <CanvasBackground isDarkMode={isDarkMode} />
        <Navbar
          isDarkMode={isDarkMode}
          links={navLinks}
          onToggleTheme={toggleTheme}
        />
        <Outlet />
        <ToastContainer
          position='top-right'
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={isDarkMode ? "dark" : "light"}
        />
      </div>
    </ThemeProvider>
  );
}
