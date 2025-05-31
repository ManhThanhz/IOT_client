import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./NavBar.css";
import CIcon from '@coreui/icons-react'
import { cilHome, cilNotes, cilUser, cilAccountLogout, cil3d } from '@coreui/icons'

const NavBar = () => {
  const location = useLocation();

  const getNavItemClass = (pathname) => {
    return location.pathname === pathname ? "navbar-item current-page" : "navbar-item";
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <CIcon icon={cil3d} size="3xl" />
        <p>IoT Smart Room</p>
      </div>
      <div className="navbar-content">
        <Link to="/Dashboard" className={getNavItemClass("/Dashboard")} id="mainFunction">
            <CIcon className="nav-icon" icon={cilHome} size="xxl" style={{'--ci-primary-color': 'black'}} />
            <p>Dashboard</p>
        </Link>

        <Link to="/History" className={getNavItemClass("/History")}>
            <CIcon className="nav-icon" icon={cilNotes} size="xxl" style={{'--ci-primary-color': 'black'}} />
            <p>History</p>
        </Link>

        <Link to="/Profile" className={getNavItemClass("/Profile")}>
            <CIcon className="nav-icon" icon={cilUser} size="xxl" style={{'--ci-primary-color': 'black'}} />
            <p>Profile</p>
        </Link>

        <Link to="/" className={getNavItemClass("/")} id="logout">
            <CIcon className="nav-icon text-danger" icon={cilAccountLogout} size="xxl" />
            <p>Log out</p>
        </Link>
      </div>
    </nav>
  );
};

export default NavBar;
