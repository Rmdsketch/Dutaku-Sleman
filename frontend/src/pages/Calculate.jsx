import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import AddModal from "../components/AddCalculate";
import CalculateModal from "../components/CalculateModal";

const Calculate = () => {
  const [crit, setCriteria] = useState([]);
  const [alt, setAlternatif] = useState([]);
  const [calculate, setCalculate] = useState([]);
  const [normalizedMatrix, setNormalizedMatrix] = useState({});
  const [preferences, setPreferences] = useState({});
  const [scoreMap, setScoreMap] = useState({});
  const [modalState, setModalState] = useState({
    open: false,
    alternativeId: null,
  });

  const getAuthConfig = () => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      console.error("Token tidak ditemukan, silakan login kembali.");
      return null;
    }
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const buildScoreMap = (records) => {
    const grouped = {};
    records.forEach((item) => {
      if (!grouped[item.alternative_id]) grouped[item.alternative_id] = {};
      grouped[item.alternative_id][item.criteria_id] = {
        id: item.id,
        value: item.value,
      };
    });
    return grouped;
  };

  const fetchData = async () => {
    const config = getAuthConfig();
    if (!config) return;
    try {
      const [
        criteriaResponse,
        alternatifResponse,
        calculateResponse,
        sawResponse,
      ] = await Promise.all([
        // axios.get("http://localhost:5000/criterias", config),
        axios.get("https://rmdsketch.pythonanywhere.com/criterias", config),
        // axios.get("http://localhost:5000/alternatives", config),
        axios.get("https://rmdsketch.pythonanywhere.com/alternatives", config),
        // axios.get("http://localhost:5000/calculates", config),
        axios.get("https://rmdsketch.pythonanywhere.com/calculates", config),
        // axios.get("http://localhost:5000/saw", config),
        axios.get("https://rmdsketch.pythonanywhere.com/saw", config),
      ]);
      setCriteria(criteriaResponse.data);
      setAlternatif(alternatifResponse.data);
      setCalculate(calculateResponse.data);
      setNormalizedMatrix(sawResponse.data.normalizedMatrix || {});
      setPreferences(sawResponse.data.preferences || {});
      setScoreMap(buildScoreMap(calculateResponse.data));
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
        const config = getAuthConfig();
        if (!config) return;
        await axios.delete(
          // `http://localhost:5000/calculates/${id}`,
          `http://rmdsketch.pythonanywhere.com/calculates/${id}`,
          config);
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

  const handleEditClick = (alternativeId) => {
    setModalState({ open: true, alternativeId });
  };

  const openModal = () => {
    setModalState({ open: true, alternativeId: null });
  };

  const closeModal = () => {
    setModalState({ open: false, alternativeId: null });
  };

  const handleModalSaved = () => {
    fetchData();
  };

  const getMatrixValue = (values, criteria) => {
    if (!values) return 0;
    if (values[criteria.id] !== undefined) return values[criteria.id];
    if (values[criteria.name] !== undefined) return values[criteria.name];
    if (criteria.criteria && values[criteria.criteria] !== undefined) {
      return values[criteria.criteria];
    }
    return 0;
  };

  const renderMatrixRows = (matrixSource, multiply = false) =>
    Object.entries(matrixSource).map(([altId, values]) => (
      <tr key={altId}>
        <td>{alt.find((item) => item.id === altId)?.id || altId}</td>
        {crit.map((criterias) => {
          const baseValue = getMatrixValue(values, criterias);
          const finalValue = multiply ? baseValue * criterias.weight : baseValue;
          return <td key={criterias.id}>{finalValue.toFixed(3)}</td>;
        })}
      </tr>
    ));

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
              <span className="breadcrumb-current">Perhitungan</span>
            </div>
            <h1>Perhitungan SAW</h1>
            <p>
              Proses perhitungan menggunakan metode Simple Additive Weighting
              untuk menentukan hasil perangkingan kandidat Dimas Diajeng.
            </p>
          </div>

          <AddModal
            criterias={crit}
            alternatives={alt}
            scoreMap={scoreMap}
            onRefresh={fetchData}
            onOpenModal={openModal}
          />

          <section className="table-card">
            <div className="table-header">
              <h3>Matrik Keputusan (X)</h3>
              <p>Nilai mentah setiap alternatif pada masing-masing kriteria.</p>
            </div>
            <div className="table-responsive ranking-table-wrapper">
              <table className="table ranking-table">
                <thead>
                  <tr>
                    <th>Alternatif</th>
                    {crit.map((criterias) => (
                      <th key={criterias.id}>{criterias.id}</th>
                    ))}
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                      {alt.map((alternative) => (
                        <tr key={alternative.id}>
                      <td>{alternative.id}</td>
                      {crit.map((criterias) => {
                        const calc = calculate.find(
                          (c) =>
                            c.alternative_id === alternative.id &&
                            c.criteria_id === criterias.id
                        );
                        return (
                          <td key={`${alternative.id}-${criterias.id}`}>
                            {calc ? calc.value : "0"}
                          </td>
                        );
                      })}
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn btn-success btn-sm rounded-0"
                            type="button"
                            title="Edit"
                            onClick={() => handleEditClick(alternative.id)}
                          >
                            <i className="fa fa-edit"></i>
                          </button>
                          <button
                            className="btn btn-danger btn-sm rounded-0"
                            type="button"
                            title="Delete"
                            onClick={() => handleDelete(alternative.id)}
                          >
                            <i className="fa fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="table-card">
            <div className="table-header">
              <h3>Matrik Normalisasi (R)</h3>
              <p>Hasil normalisasi nilai untuk menyamakan skala antar kriteria.</p>
            </div>
            <div className="table-responsive ranking-table-wrapper">
              <table className="table ranking-table">
                <thead>
                  <tr>
                    <th>Alternatif</th>
                    {crit.map((criterias) => (
                      <th key={criterias.id}>{criterias.id}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>{renderMatrixRows(normalizedMatrix)}</tbody>
                <tfoot>
                  <tr>
                    <th>Bobot</th>
                    {crit.map((criterias) => (
                      <th key={criterias.id}>{criterias.weight}</th>
                    ))}
                  </tr>
                </tfoot>
              </table>
            </div>
          </section>

          <section className="table-card">
            <div className="table-header">
              <h3>Matrik Normalisasi × Bobot</h3>
              <p>
                Nilai normalisasi yang telah dikalikan dengan bobot setiap
                kriteria.
              </p>
            </div>
            <div className="table-responsive ranking-table-wrapper">
              <table className="table ranking-table">
                <thead>
                  <tr>
                    <th>Alternatif</th>
                    {crit.map((criterias) => (
                      <th key={criterias.id}>{criterias.id}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>{renderMatrixRows(normalizedMatrix, true)}</tbody>
              </table>
            </div>
          </section>
          
          <section className="table-card">
            <div className="table-header">
              <h3>Nilai Preferensi (V)</h3>
              <p>Rekap nilai akhir setiap alternatif.</p>
            </div>
            <div className="table-responsive ranking-table-wrapper">
              <table className="table ranking-table">
                <thead>
                  <tr>
                    <th>Alternatif</th>
                    <th>Nilai Preferensi</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(preferences).length > 0 ? (
                    Object.entries(preferences).map(([altId, value]) => (
                      <tr key={altId}>
                        <td>{altId}</td>
                        <td>{Number(value).toFixed(3)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2" className="text-center">
                        Nilai preferensi belum tersedia.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <CalculateModal
            show={modalState.open}
            onClose={closeModal}
            alternatives={alt}
            criterias={crit}
            scoreMap={scoreMap}
            selectedAltId={modalState.alternativeId}
            onSaved={handleModalSaved}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Calculate;
