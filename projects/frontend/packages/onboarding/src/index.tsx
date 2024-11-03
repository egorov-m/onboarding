import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App";
import GlobalStyles from "shared/ui/GlobalStyles";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ProjectsPage } from "./pages/ProjectsPage/ProjectsPage";
import { AnalystPage } from "./pages/AnalystPage/AnalystPage";
import { ConstructorPage } from "./pages/ConstructorPage/ConstructorPage";

const router = createBrowserRouter([
  {
    path: `${process.env.REACT_APP_SERVER_PATH_PREFIX}/`,
    element: <App />,
    children: [
      {
        path: "projects",
        element: <ProjectsPage />,
      },
      {
        path: "analyst",
        element: <AnalystPage />,
      },
      {
        path: "constructor",
        element: <ConstructorPage />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <GlobalStyles />
    <RouterProvider router={router} />
  </React.StrictMode>
);
