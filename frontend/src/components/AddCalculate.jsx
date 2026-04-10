import React, { useRef, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const AddCalculate = ({
  criterias,
  alternatives,
  scoreMap,
  onRefresh,
  onOpenModal,
}) => {
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef(null);

  const getAuthConfig = () => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Sesi berakhir",
        text: "Silakan login kembali untuk melanjutkan.",
        customClass: { confirmButton: "btn btn-danger btn-md px-4 me-md-2" },
      });
      return null;
    }
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const upsertScore = async (alternativeId, criteriaId, value, config) => {
    if (value === "" || value === null || value === undefined) return;
    const numericValue = Number(value);
    const existing = scoreMap?.[alternativeId]?.[criteriaId];

    if (existing?.id) {
      await axios.patch(
        // `http://localhost:5000/calculates/${existing.id}`,
        `https://rmdsketch.pythonanywhere.com/calculates/${existing.id}`,
        { value: numericValue },
        config
      );
    } else {
      await axios.post(
        // "http://localhost:5000/calculates",
        "https://rmdsketch.pythonanywhere.com/calculates",
        {
          alternative_id: alternativeId,
          criteria_id: criteriaId,
          value: numericValue,
        },
        config
      );
    }
  };

  const handleDownloadTemplate = () => {
    if (!criterias.length) {
      Swal.fire({
        icon: "info",
        title: "Kriteria belum tersedia",
        text: "Tambahkan kriteria terlebih dahulu sebelum mengunduh template.",
        customClass: { confirmButton: "btn btn-info btn-md px-4 me-md-2" },
      });
      return;
    }
    const headers = ["Alternatif", ...criterias.map((c) => c.id)];
    const exampleRows =
      alternatives.length > 0
        ? alternatives.slice(0, 3).map((alt) =>
          [alt.id, ...criterias.map(() => "")].join(",")
        )
        : ["", ...criterias.map(() => "")];

    const csvContent = [headers.join(","), ...exampleRows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const now = new Date();
    const formattedDate = `${String(now.getDate()).padStart(2, "0")}-${String(now.getMonth() + 1).padStart(2, "0")}-${now.getFullYear()}`;

    link.href = url;
    link.download = `data-penilaian-${formattedDate}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const processCsv = async (text, config) => {
    const lines = text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    if (lines.length < 2) {
      throw new Error("File CSV kosong atau hanya memiliki header.");
    }

    const headers = lines[0].split(",").map((h) => h.trim());
    const expectedHeaders = ["Alternatif", ...criterias.map((c) => c.id)];

    // validasi jumlah header (kolom) pada CSV
    if (headers.length !== expectedHeaders.length) {
      throw new Error(
        `Header tidak sesuai. Gunakan kolom: ${expectedHeaders.join(", ")}`
      );
    }

    // validasi nama header pertama harus "Alternatif"
    if (headers[0] !== expectedHeaders[0]) {
      throw new Error(`Kolom pertama harus "${expectedHeaders[0]}", bukan "${headers[0]}"`);
    }

    // validasi kriteria id di header
    const mismatchedColumns = [];
    for (let i = 1; i < expectedHeaders.length; i += 1) {
      if ((headers[i] || "").toUpperCase() !== expectedHeaders[i].toUpperCase()) {
        mismatchedColumns.push({
          expected: expectedHeaders[i],
          actual: headers[i],
        });
      }
    }

    if (mismatchedColumns.length > 0) {
      const mismatchText = mismatchedColumns
        .map((m) => `Kolom ${m.expected} tertulis ${m.actual}`)
        .join(", ");
      throw new Error(`Kolom kriteria tidak sesuai: ${mismatchText}`);
    }

    // Validasi data baris
    let importedCount = 0;
    for (let i = 1; i < lines.length; i += 1) {
      const cells = lines[i].split(",").map((cell) => cell.trim());
      const alternativeId = cells[0];
      if (!alternativeId) continue;

      for (let j = 1; j < expectedHeaders.length; j += 1) {
        const criteria = criterias[j - 1];
        const rawValue = cells[j];
        if (rawValue === undefined || rawValue === "") continue;
        await upsertScore(alternativeId, criteria.id, rawValue, config);
        importedCount += 1;
      }
    }

    if (importedCount === 0) {
      throw new Error("Tidak ada data nilai yang valid untuk diimport.");
    }
  };

  const handleImportFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const config = getAuthConfig();
    if (!config) {
      event.target.value = "";
      return;
    }

    setIsImporting(true);
    try {
      const text = await file.text();
      await processCsv(text, config);
      Swal.fire({
        icon: "success",
        title: "Import Berhasil",
        text: "Data penilaian berhasil diperbarui dari file CSV.",
        customClass: { confirmButton: "btn btn-success btn-md px-4" },
      });
      onRefresh?.();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Format CSV Tidak Valid",
        text: error.message || "Silakan periksa format file CSV Anda.",
        customClass: { confirmButton: "btn btn-danger btn-md px-4" },
      });
    } finally {
      setIsImporting(false);
      event.target.value = "";
    }
  };

  const openFilePicker = () => {
    if (!criterias.length) {
      Swal.fire({
        icon: "info",
        title: "Kriteria belum tersedia",
        text: "Tambahkan kriteria sebelum melakukan import.",
        customClass: { confirmButton: "btn btn-info btn-md px-4 me-md-2" },
      });
      return;
    }
    fileInputRef.current?.click();
  };

  return (
    <>
      <div className="calculate-toolbar">
        <button
          type="button"
          className="btn btn-success"
          onClick={() => onOpenModal?.()}
        >
          <i className="bi bi-plus-circle me-2"></i>
          Tambah Nilai
        </button>
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={openFilePicker}
          disabled={isImporting}
        >
          <i className="bi bi-upload me-2"></i>
          {isImporting ? "Mengimpor..." : "Import CSV"}
        </button>
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={handleDownloadTemplate}
        >
          <i className="bi bi-download me-2"></i>
          Download CSV
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          hidden
          onChange={handleImportFile}
        />
      </div>
    </>
  );
};

export default AddCalculate;
