import React, { useState, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Papa from "papaparse";
import { Modal } from "bootstrap";

const AddCriteria = () => {
  const [criterias, setCriterias] = useState(Array(5).fill({ name: "", weight: "", attribute: "" }));
  const [isLoading, setIsLoading] = useState(false);
  const modalRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleNameChange = (index, value) => {
    const newCriterias = [...criterias];
    newCriterias[index] = { ...newCriterias[index], name: value };
    setCriterias(newCriterias);
  };

  const handleWeightChange = (index, value) => {
    const newCriterias = [...criterias];
    newCriterias[index] = { ...newCriterias[index], weight: value };
    setCriterias(newCriterias);
  };

  const handleAttributeChange = (index, value) => {
    const newCriterias = [...criterias];
    newCriterias[index] = { ...newCriterias[index], attribute: value };
    setCriterias(newCriterias);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const filledCriterias = criterias.filter((c) => c.name.trim());

    if (filledCriterias.length === 0) {
      Swal.fire({ icon: "warning", title: "Validasi", text: "Masukkan minimal 1 kriteria!" });
      return;
    }

    const allComplete = filledCriterias.every((c) => c.weight && c.attribute);
    if (!allComplete) {
      Swal.fire({ icon: "warning", title: "Validasi", text: "Semua kriteria harus lengkap!" });
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");

      const results = await Promise.all(
        filledCriterias.map((criteria) =>
          axios.post(
            // "http://localhost:5000/criterias",
            "https://rmdsketch.pythonanywhere.com/criterias",
            {
              name: criteria.name.trim(),
              weight: parseFloat(criteria.weight),
              attribute: criteria.attribute,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          )
        )
      );

      const successCount = results.filter((r) => r.status === 201).length;

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: `${successCount} kriteria berhasil ditambahkan!`,
      }).then(() => {
        setCriterias(Array(5).fill({ name: "", weight: "", attribute: "" }));
        window.location.reload();
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: error.response?.data?.message || "Gagal menambahkan kriteria!",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) handleImport(file);
  };

  const parseWithDelimiter = (file, delimiter) => {
    return new Promise((resolve) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        delimiter,
        complete: (results) => resolve(results),
      });
    });
  };

  const handleImport = async (file) => {
    if (!file) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");

      let results = await parseWithDelimiter(file, "\t");

      if (
        !results.data ||
        results.data.length === 0 ||
        !Object.keys(results.data[0]).includes("Name")
      ) {
        results = await parseWithDelimiter(file, ",");
      }

      if (!results.data || results.data.length === 0) {
        Swal.fire({
          icon: "warning",
          title: "File Kosong",
          text: "File CSV tidak memiliki data.",
        });
        return;
      }

      const headers = Object.keys(results.data[0]);

      if (!headers.includes("Name") || !headers.includes("Weight") || !headers.includes("Attribute")) {
        Swal.fire({
          icon: "warning",
          title: "Format Salah",
          text: "Gunakan kolom: Name, Weight, Attribute",
        });
        return;
      }

      const validData = results.data.filter(
        (row) => row.Name && row.Weight && row.Attribute
      );

      if (validData.length === 0) {
        Swal.fire({
          icon: "warning",
          title: "Tidak Ada Data Valid",
          text: "Periksa isi CSV.",
        });
        return;
      }

      const results_import = [];
      const maxRetries = 3;
      const batchSize = 4;

      for (let idx = 0; idx < validData.length; idx++) {
        const row = validData[idx];
        let success = false;
        let lastError = null;

        for (let attempt = 1; attempt <= maxRetries && !success; attempt++) {
          try {
            const res = await axios.post(
              // "http://localhost:5000/criterias",
              "https://rmdsketch.pythonanywhere.com/criterias",
              {
                name: row.Name.trim(),
                weight: parseFloat(row.Weight),
                attribute: row.Attribute.trim(),
              },
              { headers: { Authorization: `Bearer ${token}` }, timeout: 10000 }
            );

            results_import.push({ success: true, data: res.data });
            success = true;
          } catch (err) {
            lastError = err;

            if (attempt < maxRetries) {
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          }
        }

        if (!success) {
          results_import.push({ success: false, error: lastError });
        }

        if ((idx + 1) % batchSize === 0 && idx < validData.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        } else if (idx < validData.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      }

      const successCount = results_import.filter((r) => r.success).length;

      if (fileInputRef.current) fileInputRef.current.value = "";

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: `${successCount} kriteria berhasil ditambahkan!`,
      }).then(() => {
        setCriterias(Array(5).fill({ name: "", weight: "", attribute: "" }));
        window.location.reload();
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal Import",
        text: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");

      const response = await axios.get(
        // "http://localhost:5000/criterias",
        "https://rmdsketch.pythonanywhere.com/criterias", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const csvContent = [
        ["Kode", "Nama", "Bobot", "Atribut"],
        ...response.data.map((c) => [c.id, c.name, c.weight, c.attribute]),
      ];

      const csv = Papa.unparse(csvContent);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const now = new Date();
      const formattedDate = `${String(now.getDate()).padStart(2, "0")}-${String(now.getMonth() + 1).padStart(2, "0")}-${now.getFullYear()}`;

      link.href = URL.createObjectURL(blob);
      link.download = `data-kriteria-${formattedDate}.csv`;
      link.click();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal Export",
        text: error.message,
      });
    }
  };

  const openModal = () => {
    if (modalRef.current) {
      new Modal(modalRef.current).show();
    }
  };

  return (
    <>
      <div className="calculate-toolbar">
        <button className="btn btn-success" onClick={openModal}>
          <i className="bi bi-plus-circle me-2"></i>
          Tambah Kriteria
        </button>

        <button
          className="btn btn-outline-secondary"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
        >
          <i className="bi bi-upload me-2"></i>
          Import CSV
        </button>

        <button className="btn btn-outline-secondary" onClick={handleExport}>
          <i className="bi bi-download me-2"></i>
          Download CSV
        </button>

        <input
          type="file"
          ref={fileInputRef}
          className="d-none"
          accept=".csv"
          onChange={handleFileChange}
        />
      </div>

      <div
        className="modal fade"
        tabIndex="-1"
        ref={modalRef}
        aria-hidden="true"
        data-bs-backdrop="static"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <form onSubmit={handleSubmit}>
              <div className="modal-header">
                <h5 className="modal-title">Tambah Kriteria</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <p className="text-muted small">
                  Isi nama, bobot (0-1), dan atribut (Benefit/Cost). Minimal satu baris harus diisi.
                </p>
                <div className="criteria-form-grid">
                  <div className="row fw-semibold text-muted mb-2">
                    <div className="col-5">Nama Kriteria</div>
                    <div className="col-3">Bobot</div>
                    <div className="col-4">Atribut</div>
                  </div>
                  {criterias.map((criteria, index) => (
                    <div className="row g-3 mb-2 align-items-center" key={index}>
                      <div className="col-12 col-md-5">
                        <input
                          type="text"
                          className="form-control"
                          placeholder={`Kriteria ${index + 1}`}
                          value={criteria.name}
                          onChange={(e) => handleNameChange(index, e.target.value)}
                        />
                      </div>
                      <div className="col-6 col-md-3">
                        <input
                          type="number"
                          min="0"
                          max="1"
                          step="0.0001"
                          className="form-control"
                          placeholder="0.10"
                          value={criteria.weight}
                          onChange={(e) => handleWeightChange(index, e.target.value)}
                        />
                      </div>
                      <div className="col-6 col-md-4">
                        <select
                          className="form-select"
                          value={criteria.attribute}
                          onChange={(e) => handleAttributeChange(index, e.target.value)}
                        >
                          <option value="">Pilih atribut</option>
                          <option value="Benefit">Benefit</option>
                          <option value="Cost">Cost</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-light btn-md px-4 me-md-2"
                  data-bs-dismiss="modal"
                  disabled={isLoading}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn btn-success btn-md px-4 fw-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  ) : (
                    <>
                      <i className="bi bi-floppy me-2 fw-semibold"></i>
                      Simpan
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddCriteria;
