import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import AddModal from "../components/AddAlternative";
import EditModal from "../components/EditAlternative";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import Swal from "sweetalert2";

const Alternative = () => {
  const [alt, setAlternatif] = useState([]);
  const [altId, setAlternatifId] = useState();
  const [userRole, setUserRole] = useState("");

  const fetchAlternative = async () => {
    try {
      const response = await axios.get("https://rmdsketch.pythonanywhere.com/alternatives");
      setAlternatif(response.data);
    } catch (error) {
      console.error("Gagal memuat data, silahkan coba lagi nanti");
    }
  };
  const handleEdit = (id) => {
    setAlternatifId(id);
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
      if (result.isConfirmed) {
        try {
          await axios.delete(`https://rmdsketch.pythonanywhere.com/alternatives/${id}`);
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
      }
    });
  };

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    setUserRole(userRole);
    fetchAlternative();
  }, []);

  return (
    <div>
      <Header />
      <Sidebar />
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>
            Sistem Pendukung Keputusan Pemilihan Dimas Diajeng Kabupaten Sleman
          </h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/homepage">Home</Link>
              </li>
              <li className="breadcrumb-item active">
                <Link to="/alternative">Alternatif</Link>
              </li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row align-items-top">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">
                    {userRole === "Juri"
                      ? "Tabel Alternatif"
                      : "Tambah Alternatif"}
                  </h5>
                  <p className="card-text">
                    Data-data mengenai kandidat yang akan dievaluasi di
                    representasikan dalam tabel berikut.
                  </p>
                  {userRole === "Admin" && <AddModal />}
                  <div className="table-responsive">
                    <table className="table table-striped">
                      <thead>
                        <tr className="table-success">
                          <th>Kode</th>
                          <th>Nama</th>
                          <th>Atribut</th>
                          {userRole === "Admin" && <th>Aksi</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {alt.length > 0 ? (
                          alt.map((alt, i) => (
                            <tr key={i}>
                              <td>{alt.id}</td>
                              <td>{alt.nama}</td>
                              <td>{alt.atribut}</td>
                              {userRole === "Admin" && (
                                <td>
                                  <ul className="list-inline m-0">
                                    <li className="list-inline-item">
                                      <button
                                        className="btn btn-success btn-sm rounded-0"
                                        type="button"
                                        title="Edit"
                                        data-bs-toggle="modal"
                                        data-bs-target={`#editCriteriaModal-${alt.id}`}
                                        onClick={() => handleEdit(alt.id)}
                                      >
                                        <i className="fa fa-edit"></i>
                                      </button>
                                    </li>
                                    <li className="list-inline-item">
                                      <button
                                        className="btn btn-danger btn-sm rounded-0"
                                        type="button"
                                        title="Delete"
                                        onClick={() => handleDelete(alt.id)}
                                      >
                                        <i className="fa fa-trash"></i>
                                      </button>
                                    </li>
                                  </ul>
                                  <EditModal
                                    altId={altId}
                                    onSuccess={fetchAlternative}
                                  />
                                </td>
                              )}
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={userRole !== "Juri" ? "4" : "3"}
                              className="text-center"
                            >
                              Tidak ada data.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Alternative;