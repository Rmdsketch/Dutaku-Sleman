import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

const Header = () => {
  const [isSidebarToggled, setIsSidebarToggled] = useState(false);
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    const userName = localStorage.getItem("username");
    if (userRole) {
      setRole(userRole);
    }

    if (userName) {
      setUsername(userName);
    }
  }, []);

  const handleToggleSidebar = () => {
    setIsSidebarToggled(!isSidebarToggled);
    document.body.classList.toggle("toggle-sidebar");
  };

  return (
    <header id="header" className="header fixed-top d-flex align-items-center">
      <i
        className="bi bi-list toggle-sidebar-btn"
        onClick={handleToggleSidebar}
      ></i>
      <div className="d-flex align-items-center justify-content-container">
        <Link to="/homepage" className="logo d-flex align-items-center">
          <img
            className="logo-img"
            src="assets/img/logo.png"
            alt="Logo SPK Dimas Diajeng"
          />
          <span className="d-none d-lg-block">DutaKu Sleman</span>
        </Link>
      </div>

      <nav className="header-nav ms-auto">
        <ul className="d-flex align-items-center">
          <li className="nav-item dropdown pe-3">
            <Link
              className="nav-link nav-profile d-flex align-items-center pe-0"
              href="#"
              data-bs-toggle="dropdown"
            >
              <img
                src="assets/img/foto-profil.jpeg"
                alt="Profile"
                className="rounded-circle"
              />
              <span className="d-none d-md-block ms-2">
                <div className="profile-username">{username}</div>
                <div className="profile-role">{role}</div>
              </span>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;