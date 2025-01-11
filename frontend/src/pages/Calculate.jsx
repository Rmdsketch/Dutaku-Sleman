import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Header from "../components/Header";
import AddModal from "../components/AddCalculate";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

const Calculate = () => {
  const [crit, setCriteria] = useState([]);
  const [alt, setAlternatif] = useState([]);
  const [calculate, setCalculate] = useState([]);
  const [normalizedMatrix, setNormalizedMatrix] = useState([]);

  const fetchData = async () => {
    try {
      const [
        criteriaResponse,
        alternatifResponse,
        calculateResponse,
        sawResponse,
      ] = await Promise.all([
        axios.get("http://localhost:5000/criterias"),
        axios.get("http://localhost:5000/alternatives"),
        axios.get("http://localhost:5000/calculates"),
        axios.get("http://localhost:5000/saw"),
      ]);
      setCriteria(criteriaResponse.data);
      setAlternatif(alternatifResponse.data);
      setCalculate(calculateResponse.data);
      setNormalizedMatrix(sawResponse.data.normalizedMatrix);
    } catch (error) {
      console.error("Gagal memuat data:", error);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Konfirmasi Penghapusan",
      text: "Apakah anda yakin ingin menghapus data penilaian ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
      customClass: {
        confirmButton: "btn btn-danger btn-md px-4 me-md-2",
        cancelButton: "btn btn-secondary btn-md px-4 me-md-2",
      },
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/calculates/${id}`);
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Data penilaian berhasil dihapus.",
          customClass: {
            confirmButton: "btn btn-success btn-md px-4 me-md-2",
          },
        });
        fetchData();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Gagal menghapus Data Penilaian!",
          text: error.response?.data?.message,
          customClass: {
            confirmButton: "btn btn-danger btn-md px-4 me-md-2",
          },
        });
      }
    }
  };

  useEffect(() => {
    fetchData();
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
                <Link to="/calculate">Perhitungan</Link>
              </li>
            </ol>
          </nav>
        </div>
        <section className="section">
          <div className="row align-items-top">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Tambah Penilaian</h5>
                  <p className="card-text">
                    Silakan masukkan seluruh data terkait penilaian ke dalam
                    formulir yang telah disediakan. Pastikan semua data diisi
                    dengan lengkap tanpa ada yang terlewatkan, karena setiap
                    informasi sangat penting untuk proses selanjutnya.
                  </p>
                  <AddModal />

                  <div className="table-responsive">
                    <table className="table table-striped mb-0">
                      <caption>Matrik Keputusan (X)</caption>
                      <thead>
                        <tr className="table-success">
                          <th rowSpan="2" className="text-center">
                            Alternatif
                          </th>
                          <th colSpan={crit.length} className="text-center">
                            Kriteria
                          </th>
                          <th rowSpan="2" className="text-center">
                            Aksi
                          </th>
                        </tr>
                        <tr className="table-success">
                          {crit.map((criterias, i) => (
                            <th key={i} className="text-center">
                              {criterias.id}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {alt.map((alt) => (
                          <tr key={alt.id}>
                            <td className="text-center">{alt.id}</td>
                            {crit.map((crit) => {
                              const calc = calculate.find(
                                (c) =>
                                  c.alternative_id === alt.id &&
                                  c.criteria_id === crit.id
                              );
                              return (
                                <td
                                  key={`${alt.id}-${crit.id}`}
                                  className="text-center"
                                >
                                  {calc ? calc.nilai : "0"}
                                </td>
                              );
                            })}
                            <td className="text-center">
                              <button
                                className="btn btn-danger btn-sm rounded-0"
                                type="button"
                                title="Delete"
                                onClick={() => handleDelete(alt.id)}
                              >
                                <i className="fa fa-trash"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="table-responsive mt-3">
                    <table className="table table-striped mb-0">
                      <caption>Matrik Normalisasi (R)</caption>
                      <thead>
                        <tr className="table-success">
                          <th rowSpan="2" className="text-center">
                            Alternatif
                          </th>
                          <th colSpan={crit.length} className="text-center">
                            Kriteria
                          </th>
                        </tr>
                        <tr className="table-success">
                          {crit.map((criterias, i) => (
                            <th key={i} className="text-center">
                              {criterias.id}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(normalizedMatrix).map(
                          ([altId, values]) => (
                            <tr key={altId}>
                              <td className="text-center">
                                {alt.find((alt) => alt.id === altId)?.id ||
                                  altId}
                              </td>
                              {crit.map((c) => (
                                <td className="text-center" key={c.id}>
                                  {values[c.kriteria]?.toFixed(2) || "0"}
                                </td>
                              ))}
                            </tr>
                          )
                        )}
                        <tr className="table-success">
                          <th className="text-center">Bobot</th>
                          {crit.map((criterias, i) => (
                            <th key={i} className="text-center">
                              {criterias.bobot}
                            </th>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="table-responsive mt-3">
                    <table className="table table-striped mb-0">
                      <caption>Matrik Normalisasi (R) * W</caption>
                      <thead>
                        <tr className="table-success">
                          <th rowSpan="2" className="text-center">
                            Alternatif
                          </th>
                          <th colSpan={crit.length} className="text-center">
                            Kriteria
                          </th>
                        </tr>
                        <tr className="table-success">
                          {crit.map((criterias, i) => (
                            <th key={i} className="text-center">
                              {criterias.id}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(normalizedMatrix).map(
                          ([altId, values]) => (
                            <tr key={altId}>
                              <td className="text-center">
                                {alt.find((alt) => alt.id === altId)?.id ||
                                  altId}
                              </td>
                              {crit.map((criterias) => (
                                <td key={criterias.id} className="text-center">
                                  {(
                                    (values[criterias.kriteria] || 0) *
                                    criterias.bobot
                                  ).toFixed(2)}
                                </td>
                              ))}
                            </tr>
                          )
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

export default Calculate;