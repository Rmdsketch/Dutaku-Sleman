import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const EditAlternative = ({ altId, onSuccess, modalId }) => {
  const [alt, setAlternatif] = useState({
    id: "",
    name: "",
    attribute: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAlternative = async () => {
      if (altId) {
        try {
          const token =
            localStorage.getItem("token") || sessionStorage.getItem("token");
          if (!token) {
            console.error("Token tidak ditemukan, silakan login kembali.");
            return;
          }
          const response = await axios.get(
            // `http://localhost:5000/alternatives/${altId}`,
            `https://rmdsketch.pythonanywhere.com/alternatives/${altId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
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

    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Sesi berakhir",
        text: "Silakan login kembali untuk mengubah data.",
        customClass: {
          confirmButton: "btn btn-danger btn-md px-4 me-md-2",
        },
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.put(
        // `http://localhost:5000/alternatives/${altId}`,
        `https://rmdsketch.pythonanywhere.com/alternatives/${altId}`,
        alt,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
        navigate(0);
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

  const modalIdentifier =
    modalId || (altId ? `editCriteriaModal-${altId}` : "editCriteriaModal");

  return (
    <div
      className="modal fade"
      id={modalIdentifier}
      tabIndex="-1"
      aria-labelledby="modalLabel"
    >
      <div className="modal-dialog modal-dialog-centered">
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
                  id="name"
                  name="name"
                  value={alt.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="attribute" className="form-label">
                  Atribut
                </label>
                <select
                  className="form-select"
                  id="attribute"
                  name="attribute"
                  value={alt.attribute}
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
    </div>
  );
};

export default EditAlternative;
