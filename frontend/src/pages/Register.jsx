import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
    terms: false,
  });

  const [error, setError] = useState({});
  const navigate = useNavigate();

  const hidePassword = () => {
    const passwordInput = document.getElementById("yourPassword");
    const eyeIcon = document.getElementById("eyeIcon");

    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      eyeIcon.className = "bi bi-eye-slash";
    } else {
      passwordInput.type = "password";
      eyeIcon.className = "bi bi-eye";
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError({
      ...error,
      [e.target.name]: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const InvalidInput = {};
    if (!formData.username) {
      InvalidInput.username = "Masukan username disini!";
    }
    if (!formData.email) {
      InvalidInput.email = "Masukan email valid disini!";
    }
    if (!formData.password) {
      InvalidInput.password = "Masukan password disini!";
    }
    if (!formData.role) {
      InvalidInput.role = "Pilih salah satu role!";
    }
    if (!formData.terms) {
      InvalidInput.terms = "Anda harus menyetujui syarat dan ketentuan!";
    }
    if (Object.keys(InvalidInput).length > 0) {
      setError(InvalidInput);
      return;
    }

    const { terms, ...submitData } = formData;
    try {
      const response = await axios.post(
        "http://localhost:5000/auth/register",
        submitData
      );
      Swal.fire({
        icon: "success",
        title: "Berhasil Membuat Akun",
        text: response.data.status,
        customClass: {
          confirmButton: "btn btn-success btn-md px-4 me-md-2",
        },
      });
      navigate("/login");
    } catch (error) {
      if (error.response && error.response.data) {
        const { message, errors } = error.response.data;
        setError({
          ...InvalidInput,
          ...errors,
        });

        Swal.fire({
          icon: "error",
          title: "Pembuatan Akun Gagal!",
          text: message,
          customClass: {
            confirmButton: "btn btn-danger btn-md px-4 me-md-2",
          },
        });
      } else if (error.request) {
        Swal.fire({
          icon: "error",
          title: "Koneksi Bermasalah!",
          text: "Periksa koneksi internet dan coba lagi nanti",
          customClass: {
            confirmButton: "btn btn-danger btn-md px-4 me-md-2",
          },
        });
      }
    }
  };

  return (
    <div className="container h-100">
      <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
        <div className="row align-items-center justify-content-center">
          <div className="col-10 col-sm-8 col-lg-6">
            <img
              src="assets/img/logo-DutaKu.png"
              className="img-fluid"
              alt="Logo Duta Indonesia"
              width="800"
              height="500"
            />
          </div>
          <div className="col-lg-5 col-md-4 d-flex flex-column align-items-center justify-content-center">
            <div className="d-flex justify-content-center py-4">
              <div className="card mb-3 rounded-3 shadow">
                <div className="card-body">
                  <div className="pt-4 pb-2">
                    <h5 className="card-title text-center pb-0 fs-4">
                      Buat Akun
                    </h5>
                    <p className="text-center small">
                      Masukkan detail untuk membuat akun
                    </p>
                  </div>

                  <form
                    className="row g-3 needs-validation"
                    method="POST"
                    action="/register"
                    noValidate
                    onSubmit={handleSubmit}
                  >
                    <div className="col-12">
                      <label htmlFor="yourUsername" className="form-label">
                        Username
                      </label>
                      <div className="input-group has-validation">
                        <input
                          type="text"
                          name="username"
                          className={`form-control ${
                            error.username ? "is-invalid" : ""
                          }`}
                          id="yourUsername"
                          required
                          value={formData.username}
                          onChange={handleChange}
                        />
                        {error.username && (
                          <p className="invalid-feedback">{error.username}</p>
                        )}
                      </div>
                    </div>
                    <div className="col-12">
                      <label htmlFor="yourEmail" className="form-label">
                        Email
                      </label>
                      <div className="input-group has-validation">
                        <span
                          className="input-group-text"
                          id="inputGroupPrepend"
                        >
                          @
                        </span>
                        <input
                          type="email"
                          name="email"
                          className={`form-control ${
                            error.email ? "is-invalid" : ""
                          }`}
                          id="yourEmail"
                          required
                          value={formData.email}
                          onChange={handleChange}
                        />
                        {error.email && (
                          <p className="invalid-feedback">{error.email}</p>
                        )}
                      </div>
                    </div>
                    <div className="col-12">
                      <label htmlFor="yourPassword" className="form-label">
                        Password
                      </label>
                      <div className="input-group has-validation">
                        <button
                          className="input-group-text"
                          id="inputGroupPrepend"
                          onClick={hidePassword}
                          type="button"
                        >
                          <i className="bi bi-eye" id="eyeIcon"></i>
                        </button>
                        <input
                          type="password"
                          name="password"
                          className={`form-control ${
                            error.password ? "is-invalid" : ""
                          }`}
                          id="yourPassword"
                          required
                          value={formData.password}
                          onChange={handleChange}
                        />
                        {error.password && (
                          <p className="invalid-feedback">{error.password}</p>
                        )}
                      </div>
                    </div>
                    <div className="col-12">
                      <label htmlFor="role" className="form-label">
                        Role
                      </label>
                      <div className="col-lg-12">
                        <select
                          id="role"
                          name="role"
                          className={`form-select ${
                            error.role ? "is-invalid" : ""
                          }`}
                          value={formData.role}
                          onChange={handleChange}
                        >
                          <option value="" disabled>
                            Pilih Role
                          </option>
                          <option value="Admin">Admin</option>
                          <option value="Juri">Juri</option>
                        </select>
                        {error.role && (
                          <p className="invalid-feedback">{error.role}</p>
                        )}
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-check">
                        <input
                          className={`form-check-input ${
                            error.terms ? "is-invalid" : ""
                          }`}
                          name="terms"
                          type="checkbox"
                          value="true"
                          id="acceptTerms"
                          required
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              terms: e.target.checked,
                            })
                          }
                        />
                        <label
                          className="form-check-label"
                          htmlFor="acceptTerms"
                        >
                          Saya setuju dan menerima persyaratan
                        </label>
                        {error.terms && (
                          <p className="invalid-feedback">{error.terms}</p>
                        )}
                      </div>
                    </div>

                    <div className="col-12">
                      <button className="btn btn-success w-100" type="submit">
                        Buat Akun
                      </button>
                    </div>
                    <div className="col-12">
                      <p className="small mb-0">
                        Sudah memiliki akun?
                        <Link to="/login"> Masuk </Link>
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Register;
