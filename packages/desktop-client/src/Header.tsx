import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Header.css";

const Header: React.FC = () => {
  const location = useLocation();

  return (
    <header className="header">
      <nav className="nav">
        <Link
          to="/my-diory"
          className={`nav-link ${
            location.pathname === "/my-diory" ? "active" : ""
          }`}
        >
          My Diory
        </Link>
        <Link
          to="/archives"
          className={`nav-link ${
            location.pathname === "/archives" ? "active" : ""
          }`}
        >
          Archives
        </Link>
        <Link
          to="/settings"
          className={`nav-link ${
            location.pathname === "/settings" ? "active" : ""
          }`}
        >
          Settings
        </Link>
      </nav>
    </header>
  );
};

export default Header;
