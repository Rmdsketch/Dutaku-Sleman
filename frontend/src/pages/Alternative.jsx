import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import AddModal from "../components/AddAlternative";
import EditModal from "../components/EditAlternative";
import Swal from "sweetalert2";

const Alternative = () => {
  const [alternatives, setAlternatives] = useState([]);
  const [selectedAltId, setSelectedAltId] = useState(null);
  const [userRole, setUserRole] = useState("");

  const getAuthConfig = () => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      console.error("Token tidak ditemukan, silakan login kembali.");
      return null;
    }
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchAlternative = async () => {
    const config = getAuthConfig();
    if (!config) return;
    try {
      const response = await axios.get(
        // "http://localhost:5000/alternatives",
        "https://rmdsketch.pythonanywhere.com/alternatives",
        config
      );
      setAlternatives(response.data);
    } catch (error) {
      console.error("Gagal memuat data alternatif", error);
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Apakah kamu yakin?",
      text: "Data alternatif ini akan dihapus secara permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus",
      confirmButtonColor: "#d33",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (!result.isConfirmed) return;
      const config = getAuthConfig();
      if (!config) return;
      try {
        await axios.delete(
          // `http://localhost:5000/alternatives/${id}`,
          `http://rmdsketch.pythonanywhere.com/alternatives/${id}`,
           config);
        Swal.fire({
          icon: "success",
          title: "Berhasil Menghapus",
          text: "Data alternatif berhasil dihapus",
          customClass: {
            confirmButton: "btn btn-success btn-md px-4 me-md-2",
          },
        });
        fetchAlternative();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Gagal Menghapus!",
          text: error.response?.data?.message,
          customClass: {
            confirmButton: "btn btn-danger btn-md px-4 me-md-2",
          },
        });
      }
    });
  };

  useEffect(() => {
    setUserRole(localStorage.getItem("userRole"));
    fetchAlternative();
  }, []);

  const dimasCount = alternatives.filter(
    (item) => item.attribute?.toLowerCase() === "dimas"
  ).length;
  const diajengCount = alternatives.filter(
    (item) => item.attribute?.toLowerCase() === "diajeng"
  ).length;

  const stats = [
    {
      label: "Kandidat Dimas",
      value: dimasCount,
      color: "dimas",
      icon: "bi bi-people"
    },
    {
      label: "Kandidat Diajeng",
      value: diajengCount,
      color: "diajeng",
      icon: "bi bi-people"
    },
  ];

  return (
    <div className="dashboard-shell">
      <Header />
      <Sidebar />
      <main id="main" className="main dashboard-main">
        <div className="dashboard-content">
          <div className="dashboard-header">
            <div className="breadcrumb-simple">
              <Link to="/homepage">Home</Link>
              <span>/</span>
              <span className="breadcrumb-current">Alternatif</span>
            </div>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div>
                <h1>Data Alternatif</h1>
                <p>
                  Kandidat yang akan dievaluasi dalam proses seleksi Dimas Diajeng
                  Kabupaten Sleman.
                </p>
              </div>
            </div>
          </div>

          <div className="stats-container mb-4">
            {stats.map((stat) => (
              <div key={stat.label} className="stats-card-large">
                <div className="stats-card-content">
                  <div className={`stats-letter ${stat.color}`}>
                    <i className={stat.icon}></i>
                  </div>
                  <div>
                    <p className="stats-value">{stat.value}</p>
                    <p className="stats-label">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {userRole === "Admin" && <AddModal />}

          <section className="table-card">
            <div className="table-header">
              <h3>Tabel Alternatif</h3>
            </div>
            <div className="table-responsive">
              <table className="table ranking-table">
                <thead>
                  <tr>
                    <th>Kode</th>
                    <th>Nama</th>
                    <th>Kategori</th>
                    {userRole === "Admin" && <th>Aksi</th>}
                  </tr>
                </thead>
                <tbody>
                  {alternatives.length > 0 ? (
                    alternatives.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <span className="text-emerald fw-bold">{item.id}</span>
                        </td>
                        <td>{item.name}</td>
                        <td>
                          <span className={`badge-pill ${item.attribute?.toLowerCase()}`}>
                            {item.attribute}
                          </span>
                        </td>
                        {userRole === "Admin" && (
                          <td>
                            <div className="action-buttons">
                              <button
                                className="btn btn-success btn-sm rounded-0"
                                type="button"
                                title="Edit"
                                data-bs-toggle="modal"
                                data-bs-target="#editAlternativeModal"
                                onClick={() => setSelectedAltId(item.id)}
                              >
                                <i className="fa fa-edit"></i>
                              </button>
                              <button
                                className="btn btn-danger btn-sm rounded-0"
                                type="button"
                                title="Delete"
                                onClick={() => handleDelete(item.id)}
                              >
                                <i className="fa fa-trash"></i>
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={userRole === "Admin" ? 4 : 3}
                        className="text-center py-4"
                      >
                        <span className="text-muted">Tidak ada data alternatif</span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <EditModal
            altId={selectedAltId}
            modalId="editAlternativeModal"
            onSuccess={fetchAlternative}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Alternative;
