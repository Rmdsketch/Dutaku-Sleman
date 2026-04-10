import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const CalculateModal = ({
  show,
  onClose,
  alternatives,
  criterias,
  scoreMap,
  selectedAltId,
  onSaved,
}) => {
  const [form, setForm] = useState({ alternative_id: "", values: {} });
  const [isSaving, setIsSaving] = useState(false);

  const getAuthConfig = () => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Sesi berakhir",
        text: "Silakan login kembali untuk melanjutkan.",
        customClass: {
          confirmButton: "btn btn-danger btn-md px-4 me-md-2",
        },
      });
      return null;
    }

    return {
      headers: { Authorization: `Bearer ${token}` },
    };
  };

  const initializeValues = (alternativeId) => {
    if (!alternativeId) {
      setForm({ alternative_id: "", values: {} });
      return;
    }

    const existing = scoreMap?.[alternativeId] || {};
    const nextValues = {};

    criterias.forEach((criteria) => {
      nextValues[criteria.id] =
        existing[criteria.id]?.value ?? "";
    });

    setForm({
      alternative_id: alternativeId,
      values: nextValues,
    });
  };

  useEffect(() => {
    if (show) {
      const altId = selectedAltId || "";
      initializeValues(altId);
    } else {
      setForm({ alternative_id: "", values: {} });
    }
  }, [show, selectedAltId, scoreMap, criterias]);

  const handleAlternativeChange = (e) => {
    initializeValues(e.target.value);
  };

  const handleValueChange = (criteriaId, value) => {
    setForm((prev) => ({
      ...prev,
      values: {
        ...prev.values,
        [criteriaId]: value,
      },
    }));
  };

  const upsertScore = async (
    alternativeId,
    criteriaId,
    value,
    config
  ) => {
    if (value === "" || value === null || value === undefined) return;

    const numericValue = Number(value);
    const existing = scoreMap?.[alternativeId]?.[criteriaId];

    if (existing?.id) {
      await axios.patch(
        // `http://localhost:5000/calculates/${existing.id}`,
        `http://rmdsketch.pythonanywhere.com/calculates/${existing.id}`,
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const altId = form.alternative_id || selectedAltId;

    if (!altId) {
      Swal.fire({
        icon: "warning",
        title: "Pilih Alternatif",
        text: "Silakan pilih alternatif terlebih dahulu.",
        customClass: {
          confirmButton: "btn btn-warning btn-md px-4 me-md-2",
        },
      });
      return;
    }

    const config = getAuthConfig();
    if (!config) return;

    try {
      setIsSaving(true);

      for (const criteria of criterias) {
        await upsertScore(
          altId,
          criteria.id,
          form.values[criteria.id],
          config
        );
      }

      Swal.fire({
        icon: "success",
        title: "Penilaian tersimpan",
        text: "Nilai kriteria berhasil disimpan.",
        customClass: {
          confirmButton: "btn btn-success btn-md px-4 me-md-2",
        },
      });

      onSaved?.();
      onClose?.();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal menyimpan",
        text:
          error.response?.data?.message ||
          "Terjadi kesalahan.",
        customClass: {
          confirmButton: "btn btn-danger btn-md px-4 me-md-2",
        },
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div
        className={`modal fade ${show ? "show d-block" : ""}`}
        style={{ display: show ? "block" : "none" }}
        tabIndex="-1"
        aria-labelledby="calculateModalLabel"
        aria-modal={show ? "true" : undefined}
        role="dialog"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5
                className="modal-title"
                id="calculateModalLabel"
              >
                {selectedAltId
                  ? `Edit Penilaian ${selectedAltId}`
                  : "Tambah Penilaian"}
              </h5>

              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                aria-label="Close"
              />
            </div>

            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label
                    htmlFor="alternative-select"
                    className="form-label"
                  >
                    Pilih Alternatif
                  </label>

                  <select
                    id="alternative-select"
                    className="form-select"
                    value={
                      form.alternative_id ||
                      selectedAltId ||
                      ""
                    }
                    onChange={handleAlternativeChange}
                    disabled={Boolean(selectedAltId)}
                    required={!selectedAltId}
                  >
                    <option value="" disabled>
                      Pilih Alternatif
                    </option>

                    {alternatives.map((alternative) => (
                      <option
                        key={alternative.id}
                        value={alternative.id}
                      >
                        {alternative.id} - {alternative.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="criteria-input-grid">
                  {criterias.map((criteria) => (
                    <div
                      className="criteria-input-card"
                      key={criteria.id}
                    >
                      <div>
                        <p className="criteria-label">
                          {criteria.id} — {criteria.name}
                        </p>
                        <small className="text-muted">
                          Nilai 0 - 100 ({criteria.attribute})
                        </small>
                      </div>

                      <input
                        type="number"
                        min="0"
                        max="100"
                        className="form-control"
                        value={
                          form.values[criteria.id] ?? ""
                        }
                        onChange={(e) =>
                          handleValueChange(
                            criteria.id,
                            e.target.value
                          )
                        }
                      />
                    </div>
                  ))}
                </div>

                <div className="text-end mt-4">
                  <button
                    type="button"
                    className="btn btn-light btn-md px-4 me-md-2"
                    onClick={onClose}
                  >
                    Batal
                  </button>

                  <button
                    type="submit"
                    className="btn btn-success btn-md px-4 fw-semibold"
                    disabled={isSaving}
                  >
                    {isSaving ? (
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

      {show && (
        <div className="modal-backdrop fade show"></div>
      )}
    </>
  );
};

export default CalculateModal;
