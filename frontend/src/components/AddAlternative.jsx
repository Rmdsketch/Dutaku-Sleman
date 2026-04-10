import React, { useState, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Papa from "papaparse";
import { Modal } from "bootstrap";

const AddAlternative = () => {
  const [candidates, setCandidates] = useState(Array(5).fill({ name: "", category: "" }));
  const [isLoading, setIsLoading] = useState(false);
  const modalRef = useRef(null);
  const fileInputRef = useRef(null);

  const getAuthConfig = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}` },
  });

  const handleNameChange = (index, value) => {
    const newCandidates = [...candidates];
    newCandidates[index] = { ...newCandidates[index], name: value };
    setCandidates(newCandidates);
  };

  const handleCategoryChange = (index, value) => {
    const newCandidates = [...candidates];
    newCandidates[index] = { ...newCandidates[index], category: value };
    setCandidates(newCandidates);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const filledCandidates = candidates.filter((c) => c.name.trim());

    if (filledCandidates.length === 0) {
      Swal.fire({ icon: "warning", title: "Validasi", text: "Masukkan minimal 1 nama!" });
      return;
    }

    const allHaveCategory = filledCandidates.every((c) => c.category);
    if (!allHaveCategory) {
      Swal.fire({ icon: "warning", title: "Validasi", text: "Semua nama harus memiliki kategori!" });
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const results = await Promise.all(
        filledCandidates.map((candidate) =>
          axios.post(
            // "http://localhost:5000/alternatives",
            "https://rmdsketch.pythonanywhere.com/alternatives",
            { name: candidate.name.trim(), attribute: candidate.category },
            { headers: { Authorization: `Bearer ${token}` } }
          )
        )
      );

      const successCount = results.filter((r) => r.status === 201).length;
      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: `${successCount} kandidat berhasil ditambahkan!`,
      }).then(() => {
        setCandidates(Array(5).fill({ name: "", category: "" }));
        window.location.reload();
      });
    } catch (error) {
      Swal.fire({ icon: "error", title: "Gagal", text: error.response?.data?.message || "Gagal menambahkan kandidat!" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (isLoading) {
      Swal.fire({
        icon: "info",
        title: "Import Sedang Berjalan",
        text: "Tunggu hingga proses sebelumnya selesai sebelum mengunggah lagi.",
        customClass: { confirmButton: "btn btn-info btn-md px-4 me-md-2" },
      });
      e.target.value = "";
      return;
    }

    const file = e.target.files[0];
    if (file) {
      handleImport(file);
    }
  };

  const parseWithDelimiter = (file, delimiter) => {
    return new Promise((resolve) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        delimiter: delimiter,
        complete: (results) => {
          resolve(results);
        },
      });
    });
  };

  const handleImport = async (file) => {
    if (!file) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");

      // coba parsing dengan tab delimiter terlebih dahulu
      let results = await parseWithDelimiter(file, "\t");

      // mengecek hasil parsing sesuai dengan kolom/header
      if (
        !results.data ||
        results.data.length === 0 ||
        !Object.keys(results.data[0]).includes("Name")
      ) {
        results = await parseWithDelimiter(file, ",");
      }

      // validasi header 
      if (!results.data || results.data.length === 0) {
        Swal.fire({
          icon: "warning",
          title: "File Kosong",
          text: "File CSV tidak memiliki data.",
        });
        setIsLoading(false);
        return;
      }

      const firstRow = results.data[0];
      const headers = Object.keys(firstRow);

      if (!headers.includes("Name") || !headers.includes("Attribute")) {
        Swal.fire({
          icon: "warning",
          title: "Format Header Salah",
          text: "Gunakan kolom: Name, Attribute",
        });
        setIsLoading(false);
        return;
      }

      const validData = results.data.filter(
        (row) => row.Name && row.Attribute
      );

      if (validData.length === 0) {
        Swal.fire({
          icon: "warning",
          title: "Tidak Ada Data Valid",
          text: "Pastikan semua baris memiliki nilai untuk Name dan Attribute.",
        });
        setIsLoading(false);
        return;
      }

      // mengirim data dengan retry dan batching untuk menghindari rate limit
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
              // "http://localhost:5000/alternatives",
              "https://rmdsketch.pythonanywhere.com/alternatives",
              {
                name: row.Name.trim(),
                attribute: row.Attribute.trim().charAt(0).toUpperCase() + row.Attribute.trim().slice(1).toLowerCase(),
              },
              { headers: { Authorization: `Bearer ${token}` }, timeout: 10000 }
            );
            results_import.push({ success: true, data: res.data });
            success = true;
          } catch (err) {
            lastError = {
              status: err.response?.status,
              statusText: err.response?.statusText,
              data: err.response?.data,
              message: err.message,
              code: err.code
            };
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

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: `${successCount} alternatif berhasil ditambahkan!`,
      }).then(() => {
        setAlternatives(Array(5).fill({ name: "", attribute: "" }));
        window.location.reload();
      });
    } catch (error) {
      console.error("Import error:", error);
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
        // "http://localhost:5000/alternatives",
        "https://rmdsketch.pythonanywhere.com/alternatives", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const csvContent = [
        ["Kode", "Nama", "Kategori"],
        ...response.data.map((alt) => [alt.id, alt.name, alt.attribute]),
      ];

      const csv = Papa.unparse(csvContent);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      const now = new Date();
      const formattedDate = `${String(now.getDate()).padStart(2, "0")}-${String(now.getMonth() + 1).padStart(2, "0")}-${now.getFullYear()}`;

      link.setAttribute("href", url);
      link.setAttribute("download", `data-alternatif-${formattedDate}.csv`);
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export error:", error);
    }
  };

  const openModal = () => {
    if (modalRef.current) {
      const bsModal = new Modal(modalRef.current);
      bsModal.show();
    }
  };

  return (
    <div className="calculate-toolbar">
      <button className="btn btn-success" onClick={() => openModal()}>
        <i className="bi bi-plus-circle me-2"></i>Tambah Alternatif
      </button>

      <button
        className="btn btn-outline-secondary"
        onClick={() => fileInputRef.current?.click()}
        disabled={isLoading}
      >
        <i className="bi bi-upload me-2"></i>Import CSV
      </button>

      <button className="btn btn-outline-secondary" onClick={handleExport}>
        <i className="bi bi-download me-2"></i>Download CSV
      </button>

      <input
        type="file"
        ref={fileInputRef}
        id="importFileInput"
        className="d-none"
        accept=".csv"
        onChange={handleFileChange}
      />

      <div className="modal fade" ref={modalRef} id="inputAlternatifModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <div>
                <h5 className="modal-title">
                  <i className="bi bi-people me-2"></i>Kelola Kandidat
                </h5>
                <p className="text-muted small mb-0 mt-1">
                  Isi hingga 5 kandidat sekaligus. Baris kosong akan diabaikan.
                </p>
              </div>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="candidates-form">
                  {candidates.map((candidate, index) => (
                    <div key={index} className="row mb-3 align-items-center">
                      <div className="col-auto">
                        <span className="badge bg-light text-dark px-3 py-2">{index + 1}</span>
                      </div>
                      <div className="col-md-6">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Nama kandidat"
                          value={candidate.name}
                          onChange={(e) => handleNameChange(index, e.target.value)}
                        />
                      </div>
                      <div className="col-md-4">
                        <select
                          className="form-select"
                          value={candidate.category}
                          onChange={(e) => handleCategoryChange(index, e.target.value)}
                        >
                          <option value="">Kategori</option>
                          <option value="Dimas">Dimas</option>
                          <option value="Diajeng">Diajeng</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-end mt-4">
                  <button
                    type="button"
                    className="btn btn-light btn-md px-4 me-md-2"
                    onClick={() => {
                      const modal = Modal.getInstance(modalRef.current);
                      modal?.hide();
                    }}
                  >
                    Batal
                  </button>

                  <button type="submit" className="btn btn-success btn-md px-4 fw-semibold" disabled={isLoading}>
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
      </div>
    </div>
  );
};

export default AddAlternative;
