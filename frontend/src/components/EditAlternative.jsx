import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const EditAlternative = ({ altId, onSuccess }) => {
  const [alt, setAlternatif] = useState({
    id: "",
    nama: "",
    atribut: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAlternative = async () => {
      if (altId) {
        try {
          const response = await axios.get(
            `https://rmdsketch.pythonanywhere.com/alternatives/${altId}`
          );
          setAlternatif(response.data);
        } catch (error) {
          console.error("Gagal memuat data:", error);
        }
      }
    };
    fetchAlternative();
  }, [altId]);

  const handleChange = (e) => {
    setAlternatif({
      ...alt,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.put(
        `http://localhost:5000/alternatives/${altId}`,
        alt
      );
      Swal.fire({
        icon: "success",
        title: "Berhasil mengubah Data Alternatif",
        text: response.data.message,
        customClass: {
          confirmButton: "btn btn-success btn-md px-4 me-md-2",
        },
      }).then(() => {
        onSuccess();
        window.location.reload();
      });
      setIsLoading(false);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal Mengubah Data Alternatif",
        text: error.response?.data?.message,
        customClass: {
          confirmButton: "btn btn-danger btn-md px-4 me-md-2",
        },
      });
      setIsLoading(false);
    }
  };

  return (
    <div
      className="modal fade"
      id={`editCriteriaModal-${altId}`}
      tabIndex="-1"
      aria-labelledby="modalLabel"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Alternatif</h5>
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
                <label htmlFor="alt" className="form-label">
                  Alternatif
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="nama"
                  name="nama"
                  value={alt.nama}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="atribut" className="form-label">
                  Atribut
                </label>
                <select
                  className="form-select"
                  id="atribut"
                  name="atribut"
                  value={alt.atribut}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Pilih atribut
                  </option>
                  <option value="Dimas">Dimas</option>
                  <option value="Diajeng">Diajeng</option>
                </select>
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
  );
};

export default EditAlternative;