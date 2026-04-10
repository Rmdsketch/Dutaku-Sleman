import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const sections = [
    {
      title: "Menu",
      items: [
        {
          label: "Dashboard",
          path: "/homepage",
          icon: "bi bi-grid",
        },
      ],
    },
    {
      title: "Master Data",
      items: [
        {
          label: "Kriteria",
          path: "/criteria",
          icon: "bi bi-list-check",
        },
        {
          label: "Alternatif",
          path: "/alternative",
          icon: "bi bi-people",
        },
        {
          label: "Perhitungan",
          path: "/calculate",
          icon: "bi bi-calculator",
        },
        {
          label: "Hasil",
          path: "/result",
          icon: "bi bi-trophy",
        },
      ],
    },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Konfirmasi Keluar",
      text: "Apakah anda yakin ingin keluar?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Keluar",
      cancelButtonText: "Batal",
      customClass: {
        confirmButton: "btn btn-danger btn-md px-4 me-md-2",
        cancelButton: "btn btn-secondary btn-md px-4 me-md-2",
      },
    });

    if (result.isConfirmed) {
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");

      Swal.fire({
        icon: "success",
        title: "Berhasil Keluar",
        text: "Anda telah berhasil keluar.",
        customClass: {
          confirmButton: "btn btn-success btn-md px-4 me-md-2",
        },
      }).then(() => {
        navigate("/login");
      });
    }
  };

  const handleCloseSidebar = () => {
    document.body.classList.remove("toggle-sidebar");
  };

  return (
    <>
      <div
        className="sidebar-overlay"
        onClick={handleCloseSidebar}
      ></div>
      <aside id="sidebar" className="sidebar">
        <div className="sidebar-nav" id="sidebar-nav">
          {sections.map((section) => (
            <div className="sidebar-section" key={section.title}>
              <p className="sidebar-section-title">{section.title}</p>
              <ul className="sidebar-section-list">
                {section.items.map((item) => (
                  <li className="nav-item" key={item.path}>
                    <Link
                      to={item.path}
                      className={`nav-link modern ${isActive(item.path) ? "active" : ""
                        }`}
                      onClick={handleCloseSidebar}
                    >
                      <span className="nav-icon">
                        <i className={item.icon}></i>
                      </span>
                      <span className="nav-text">{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="sidebar-footer">
          <button
            type="button"
            className="nav-link modern logout"
            onClick={handleLogout}
          >
            <span className="nav-text">Keluar</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
