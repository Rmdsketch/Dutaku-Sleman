import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const AddCalculate = () => {
  const [calculate, setCalculate] = useState({
    alternative_id: "",
    criteria_id: "",
    nilai: "",
  });

  const [alternatives, setAlternatives] = useState([]);
  const [criterias, setCriterias] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const alternativesResponse = await axios.get(
          "https://rmdsketch.pythonanywhere.com/alternatives"
        );
        setAlternatives(alternativesResponse.data);

        const criteriasResponse = await axios.get(
          "https://rmdsketch.pythonanywhere.com/criterias"
        );
        setCriterias(criteriasResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCalculate({ ...calculate, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        "https://rmdsketch.pythonanywhere.com/calculates",
        calculate
      );
      Swal.fire({
        icon: "success",
        title: "Berhasil menambahkan Data Penilaian",
        text: response.data.message,
        customClass: {
          confirmButton: "btn btn-success btn-md px-4 me-md-2",
        },
      }).then(() => {
        setIsLoading(false);
        window.location.reload();
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal menambahkan Data Penilaian!",
        text: error.response?.data?.message,
        customClass: {
          confirmButton: "btn btn-danger btn-md px-4 me-md-2",
        },
      });
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="row">
        <div className="col-lg-6">
          <div className="d-flex justify-content-between mb-3">
            <button
              type="button"
              className="btn btn-success"
              data-bs-toggle="modal"
              data-bs-target="#inputCalculateModal"
            >
              <i className="bi bi-plus-circle me-2"></i>
              Tambah
            </button>

            <div
              className="modal fade"
              id="inputCalculateModal"
              tabIndex="-1"
              aria-labelledby="modalLabel"
            >
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="modalLabel">
                      Tambah Penilaian
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body">
                    <form onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <label htmlFor="alternative_id" className="form-label">
                          Pilih Alternatif
                        </label>
                        <select
                          className="form-select"
                          id="alternative_id"
                          name="alternative_id"
                          value={calculate.alternative_id}
                          onChange={handleChange}
                          required
                        >
                          <option value="" disabled>
                            Pilih Alternatif
                          </option>
                          {alternatives.map((alternative) => (
                            <option key={alternative.id} value={alternative.id}>
                              {alternative.id} - {alternative.nama}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="mb-3">
                        <label htmlFor="criteria_id" className="form-label">
                          Pilih Kriteria
                        </label>
                        <select
                          className="form-select"
                          id="criteria_id"
                          name="criteria_id"
                          value={calculate.criteria_id}
                          onChange={handleChange}
                          required
                        >
                          <option value="" disabled>
                            Pilih Kriteria
                          </option>
                          {criterias.map((criteria) => (
                            <option key={criteria.id} value={criteria.id}>
                              {criteria.id} - {criteria.kriteria}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="mb-3">
                        <label htmlFor="nilai" className="form-label">
                          Nilai
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          className="form-control"
                          id="nilai"
                          name="nilai"
                          placeholder="Masukkan Nilai"
                          value={calculate.nilai}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="text-center">
                        <button
                          type="submit"
                          className="btn btn-success"
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
                              <i className="bi bi-floppy me-2"></i> Simpan
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
        </div>
      </div>
    </div>
  );
};

export default AddCalculate;