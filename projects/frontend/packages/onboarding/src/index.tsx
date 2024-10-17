import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';
import GlobalStyles from 'shared/ui/GlobalStyles';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import { ProjectsPage } from './pages/ProjectsPage/ProjectsPage';
import { AnalystPage } from './pages/AnalystPage/AnalystPage';

const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "projects",
        element: <ProjectsPage />,
      },
      {
        path: "analyst",
        element: <AnalystPage/>
      }
    ],
  },
]);
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <GlobalStyles />
    <RouterProvider router={router} />
  </React.StrictMode>
);
