import React from 'react';


import { Navbar } from '../features/Navbar/Navbar';
import { navLinks } from '../features/Navbar/constants';
import { Outlet } from 'react-router';

export default function App() {
  console.log('REACT_APP_SERVER_PATH_PREFIX:', process.env.REACT_APP_SERVER_PATH_PREFIX);

  
  return (
      <div>
        <Navbar links = {navLinks}/>
        <Outlet />
      </div>
  );
}