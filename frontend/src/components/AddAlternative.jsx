import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const AddAlternative = () => {
  const [alt, setAlternatif] = useState({
    nama: "",
    atribut: "",
  });
  const [isLoading, setIsLoading] = useState(false);

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
      const response = await axios.post(
        "https://rmdsketch.pythonanywhere.com/alternatives",
        alt
      );
      Swal.fire({
        icon: "success",
        title: "Berhasil menambah Data Alternatif",
        text: response.data.message,
        customClass: {
          confirmButton: "btn btn-success btn-md px-4 me-md-2",
        },
      }).then(() => {
        window.location.reload();
      });
      setIsLoading(false);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal menambah Data Alternatif!",
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
              data-bs-target="#inputAlternatifModal"
            >
              <i className="bi bi-plus-circle me-2"></i>
              Tambah
            </button>

            <div
              className="modal fade"
              id="inputAlternatifModal"
              tabIndex="-1"
              aria-labelledby="modalLabel"
            >
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="modalLabel">
                      Tambah Alternatif
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
                        <label htmlFor="nama" className="form-label">
                          Nama Alternatif
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="nama"
                          name="nama"
                          placeholder="Masukkan Nama"
                          value={alt.nama}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="atribut" className="form-label">
                          Atribut
                        </label>
                        <div className="col-lg-12">
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

export default AddAlternative;