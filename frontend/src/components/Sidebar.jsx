import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Sidebar = () => {
  const navigate = useNavigate();

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

  return (
    <aside id="sidebar" className="sidebar">
      <ul className="sidebar-nav" id="sidebar-nav">
        <li className="nav-item">
          <Link className="nav-link collapsed" to="/homepage">
            <i className="bi bi-grid"></i>
            <span>Dashboard</span>
          </Link>
        </li>

        <li className="nav-heading">Master Data</li>
        <li className="nav-item">
          <Link className="nav-link collapsed" to="/criteria">
            <i className="bi bi-columns"></i>
            <span>Kriteria</span>
          </Link>
        </li>

        <li className="nav-item">
          <Link className="nav-link collapsed" to="/alternative">
            <i className="bi bi-collection"></i>
            <span>Alternatif</span>
          </Link>
        </li>

        <li className="nav-item">
          <Link className="nav-link collapsed" to="/calculate">
            <i className="bi bi-card-checklist"></i>
            <span>Perhitungan</span>
          </Link>
        </li>

        <li className="nav-item">
          <Link className="nav-link collapsed" to="/result">
            <i className="bi bi-clipboard-data"></i>
            <span>Hasil</span>
          </Link>
        </li>

        <li className="nav-heading">Aksebilitas</li>
        <li className="nav-item">
          <button
            className="nav-link btn btn-link collapsed"
            onClick={handleLogout}
          >
            <i className="bi bi-box-arrow-right"></i>
            <span>Keluar</span>
          </button>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;