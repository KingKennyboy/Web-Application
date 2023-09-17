import { Outlet } from "react-router-dom";
import Navbar from './components/Navbar_User/Navbar_User';


import React from 'react'

const Layout = () => {
  return (
    <div>
      <Navbar />
      <div>
        <Outlet />
      </div>
    </div>
  )
}

export default Layout