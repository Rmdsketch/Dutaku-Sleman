import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import AddModal from "../components/AddCriteria";

const Criteria = () => {
  const [crit, setCriteria] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [sliderValues, setSliderValues] = useState({});
  const [isSavingWeights, setIsSavingWeights] = useState(false);

  const sortCriteriaById = (data = []) => {
    return [...data].sort((a, b) => {
      const numA = parseInt(a?.id?.match(/\d+/)?.[0] || 0, 10);
      const numB = parseInt(b?.id?.match(/\d+/)?.[0] || 0, 10);

      if (numA === numB) {
        return (a?.id || "").localeCompare(b?.id || "");
      }

      return numA - numB;
    });
  };

  const getAuthConfig = () => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Sesi Habis",
        text: "Silakan login ulang untuk melanjutkan.",
      });
      return null;
    }

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const fetchCriteria = async () => {
    try {
      const config = getAuthConfig();
      if (!config) return;

      const response = await axios.get(
        // "http://localhost:5000/criterias",
        "https://rmdsketch.pythonanywhere.com/criterias",
        config);
      const sorted = sortCriteriaById(response.data);
      setCriteria(sorted);
      const mapped = {};
      sorted.forEach((item) => {
        mapped[item.id] = Number(item.weight || 0);
      });
      setSliderValues(mapped);
    } catch (error) {
      console.error("Gagal memuat data, silahkan coba lagi nanti");
    }
  };

  useEffect(() => {
    setUserRole(localStorage.getItem("userRole"));
    fetchCriteria();
  }, []);

  const totalWeight = useMemo(
    () =>
      crit.reduce(
        (sum, item) => sum + Number(sliderValues[item.id] ?? item.weight ?? 0),
        0
      ),
    [crit, sliderValues]
  );

  const totalWeightPercent = Math.round(totalWeight * 100);
  const displayedTotalWeight = Math.min(totalWeightPercent, 100);
  const isWeightExceeded = totalWeightPercent > 100;

  const formatWeight = (value) => Number(value || 0).toFixed(2);

  const attributeClass = (attribute) => {
    const key = attribute?.toLowerCase() || "";
    if (key === "benefit") return "benefit";
    if (key === "cost") return "cost";
    return "neutral";
  };

  const handleDeleteCriteria = async (criteria) => {
    const result = await Swal.fire({
      title: `Hapus ${criteria.name}?`,
      text: "Aksi ini tidak dapat dibatalkan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#dc3545",
    });

    if (!result.isConfirmed) return;

    try {
      const config = getAuthConfig();
      if (!config) return;

      await axios.delete(
        // `http://localhost:5000/criterias/${criteria.id}`,
        `http://rmdsketch.pythonanywhere.com/criterias/${criteria.id}`,
        config);
      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: `${criteria.name} telah dihapus.`,
      });
      fetchCriteria();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal Menghapus",
        text: error.response?.data?.message || "Terjadi kesalahan.",
      });
    }
  };

  const handleEditCriteria = async (criteria) => {
    const { value: formValues } = await Swal.fire({
      title: `Edit ${criteria.id}`,
      html: `
        <div class="text-start">
          <label class="form-label">Nama Kriteria</label>
          <input id="swal-name" class="form-control" value="${criteria.name || ""}" />
        </div>
        <div class="text-start mt-3">
          <label class="form-label">Bobot</label>
          <input id="swal-weight" type="number" min="0" step="0.0001" max="1" class="form-control" value="${criteria.weight || 0}" />
        </div>
        <div class="text-start mt-3">
          <label class="form-label">Atribut</label>
          <select id="swal-attribute" class="form-select">
            <option value="Benefit" ${criteria.attribute === "Benefit" ? "selected" : ""}>Benefit</option>
            <option value="Cost" ${criteria.attribute === "Cost" ? "selected" : ""}>Cost</option>
          </select>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Simpan",
      preConfirm: () => {
        const name = document.getElementById("swal-name").value.trim();
        const weight = parseFloat(document.getElementById("swal-weight").value);
        const attribute = document.getElementById("swal-attribute").value;

        if (!name) {
          Swal.showValidationMessage("Nama kriteria wajib diisi");
          return false;
        }
        if (isNaN(weight) || weight <= 0) {
          Swal.showValidationMessage("Bobot harus lebih dari 0");
          return false;
        }

        return { name, weight, attribute };
      },
    });

    if (!formValues) return;

    try {
      const config = getAuthConfig();
      if (!config) return;

      await axios.put(
        // `http://localhost:5000/criterias/${criteria.id}`,
        `http://rmdsketch.pythonanywhere.com/criterias/${criteria.id}`,
        formValues,
        config
      );
      Swal.fire({ icon: "success", title: "Berhasil", text: "Kriteria diperbarui." });
      fetchCriteria();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal Menyimpan",
        text: error.response?.data?.message || "Terjadi kesalahan.",
      });
    }
  };

  const handleSliderChange = (id, value) => {
    setSliderValues((prev) => ({
      ...prev,
      [id]: Number(value),
    }));
  };

  const handleDistributeEvenly = () => {
    if (!crit.length) return;
    const evenWeight = 1 / crit.length;
    const mapped = {};
    crit.forEach((item) => {
      mapped[item.id] = parseFloat(evenWeight.toFixed(4));
    });
    setSliderValues(mapped);
  };

  const handleSaveWeights = async () => {
    if (!crit.length) return;

    const config = getAuthConfig();
    if (!config) return;

    const payload = crit.map((item) => ({
      id: item.id,
      weight: Number(sliderValues[item.id] ?? item.weight ?? 0),
    }));

    setIsSavingWeights(true);
    try {
      await axios.patch(
        // "http://localhost:5000/criterias/weights",
        "http://rmdsketch.pythonanywhere.com/criterias/weights",
        { weights: payload },
        config
      );
      Swal.fire({
        icon: "success",
        title: "Bobot Tersimpan",
        text: "Pembaruan bobot kriteria berhasil disimpan.",
      });
      fetchCriteria();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal Menyimpan Bobot",
        text: error.response?.data?.message || "Periksa koneksi Anda.",
      });
    } finally {
      setIsSavingWeights(false);
    }
  };

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
              <span className="breadcrumb-current">Kriteria</span>
            </div>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div>
                <h1>Data Kriteria</h1>
                <p>
                  Kriteria penilaian yang digunakan dalam proses seleksi Dimas
                  Diajeng. Nilai bobot memastikan keputusan akhir tetap objektif dan
                  terukur.
                </p>
              </div>
            </div>
          </div>

          {userRole === "Admin" && <AddModal />}

          <section className="table-card">
            <div className="table-header">
              <h3>Tabel Kriteria</h3>
            </div>
            <div className="table-responsive">
              <table className="table ranking-table">
                <thead>
                  <tr>
                    <th>Kode</th>
                    <th>Kriteria</th>
                    <th>Bobot</th>
                    <th>Atribut</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {crit.length > 0 ? (
                    crit.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <span className="text-emerald fw-bold">{item.id}</span>
                        </td>
                        <td>{item.name}</td>
                        <td>{formatWeight(item.weight)}</td>
                        <td>
                          <span
                            className={`badge-pill ${attributeClass(
                              item.attribute
                            )}`}
                          >
                            {item.attribute}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn btn-success btn-sm rounded-0"
                              type="button"
                              title="Edit"
                              onClick={() => handleEditCriteria(item)}
                            >
                              <i className="fa fa-edit"></i>
                            </button>
                            <button
                              className="btn btn-danger btn-sm rounded-0"
                              type="button"
                              title="Delete"
                              onClick={() => handleDeleteCriteria(item)}
                            >
                              <i className="fa fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center py-4">
                        <span className="text-muted">Tidak ada data kriteria</span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="legend-card">
            <h3>Keterangan</h3>
            <ul>
              <li>
                <span className="legend-dot benefit"></span>
                <strong>Benefit</strong>: Semakin tinggi nilai, semakin baik.
              </li>
              <li>
                <span className="legend-dot cost"></span>
                <strong>Cost</strong>: Semakin rendah nilai, semakin baik.
              </li>
              <li>
                <span className="legend-dot neutral"></span>
                Total bobot semua kriteria ={" "}
                <strong>{displayedTotalWeight}</strong>
                {isWeightExceeded && (
                  <span className="text-danger ms-2">(Melebihi 100)</span>
                )}
              </li>
            </ul>
          </section>

          {crit.length > 0 && (
            <section className="table-card weight-card mt-4">
              <div className="weight-card-header">
                <div>
                  <h3>Atur Bobot Kriteria</h3>
                  <p className="mb-0">
                    Sesuaikan bobot setiap kriteria agar total mendekati 100.
                  </p>
                </div>
                <div className="weight-actions">
                  <button
                    className="btn btn-light btn-md px-4 me-md-2"
                    onClick={handleDistributeEvenly}
                  >
                    Distribusi Rata
                  </button>
                  <button
                    className="btn btn-success btn-md px-4 me-md-2"
                    disabled={isSavingWeights}
                    onClick={handleSaveWeights}
                  >
                    <i className="bi bi-floppy me-2 fw-bold"></i>
                    {isSavingWeights ? "Menyimpan..." : "Simpan"}
                  </button>
                </div>
              </div>
              <div className="weights-list">
                {crit.map((item) => {
                  const currentWeight = sliderValues[item.id] ?? item.weight ?? 0;
                  return (
                    <div key={item.id} className="weight-slider-row">
                      <div className="row-head">
                        <div className="weight-labels">
                          <span className="weight-label-code">{item.id}</span>
                          <span className="weight-label-name">{item.name}</span>
                        </div>
                        <span className="weight-percentage">
                          {(currentWeight * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="slider-wrapper">
                        <div className="slider-track">
                          <div
                            className="slider-fill"
                            style={{ width: `${currentWeight * 100}%` }}
                          ></div>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.0001"
                          value={currentWeight}
                          onChange={(e) =>
                            handleSliderChange(item.id, Number(e.target.value))
                          }
                          className="form-range weight-range"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Criteria;
