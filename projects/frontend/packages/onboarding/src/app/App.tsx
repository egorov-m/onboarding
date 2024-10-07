import React from 'react';

import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { LandingPage } from '../pages/LandingPage/LandingPage';
import { AnalystPage } from '../pages/AnalystPage/AnalystPage';
import { ProjectsPage } from '../pages/ProjectsPage/ProjectsPage';
import { Navbar } from '../features/Navbar/Navbar';
import { navLinks } from '../features/Navbar/constants';

export default function App() {
  return (
    <Router>
      <div>
        <Navbar links = {navLinks}/>

        <Routes>
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/analyst" element={<AnalystPage />} />
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </div>
    </Router>
  );
}