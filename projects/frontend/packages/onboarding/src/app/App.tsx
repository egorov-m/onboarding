import React from "react";

import { Navbar } from "../features/Navbar/Navbar";
import { navLinks } from "../features/Navbar/constants";
import { Outlet } from "react-router";

export default function App() {
  return (
    <div>
      <Navbar links={navLinks} />
      <Outlet />
    </div>
  );
}
