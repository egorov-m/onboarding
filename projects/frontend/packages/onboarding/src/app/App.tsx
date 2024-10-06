import React from 'react';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import { LandingPage } from '../pages/LandingPage/LandingPage';
import { AnalystPage } from '../pages/AnalystPage/AnalystPage';
import { ProjectsPage } from '../pages/ProjectsPage/ProjectsPage';
import { Navbar } from '../features/Navbar/Navbar';

export default function App() {
  return (
    <Router>
      <div>
        <Navbar />

        <Routes>
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/analyst" element={<AnalystPage />} />
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </div>
    </Router>
  );
}