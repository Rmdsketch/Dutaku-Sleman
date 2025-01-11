import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });

  const [error, setError] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");
    if (token && userRole) {
      navigate("/homepage");
    }
  }, [navigate]);

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
      InvalidInput.username = "Username harus diisi!";
    }
    if (!formData.password) {
      InvalidInput.password = "Password harus diisi!";
    }

    if (!formData.rememberMe) {
      InvalidInput.rememberMe = "Anda harus menyetujui sebelum masuk!";
    }

    if (Object.keys(InvalidInput).length > 0) {
      setError(InvalidInput);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/auth/login",
        formData
      );

      const { token, username, role } = response.data;
      if (rememberMe) {
        localStorage.setItem("token", token);
        localStorage.setItem("username", username);
        localStorage.setItem("userRole", role);
      } else {
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("username", username);
        sessionStorage.setItem("userRole", role);
      }
      navigate("/homepage");
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data.message;
        if (errorMessage) {
          Swal.fire({
            icon: "error",
            title: "Gagal Masuk!",
            text: errorMessage,
            customClass: {
              confirmButton: "btn btn-danger btn-md px-4 me-md-2",
            },
          });
        }
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
              width="500"
              height="800"
            />
          </div>
          <div className="col-lg-5 col-md-6 d-flex flex-column align-items-center justify-content-center">
            <div className="d-flex justify-content-center py-4"></div>
            <div className="card mb-3 rounded-3 shadow">
              <div className="card-body">
                <div className="pt-4 pb-2">
                  <h5 className="card-title text-center pb-0 fs-4">
                    Masuk ke Akun
                  </h5>
                  <p className="text-center small">
                    Masukkan username & password
                  </p>
                </div>

                <form
                  className="row g-3 needs-validation"
                  noValidate
                  onSubmit={handleSubmit}
                >
                  <div className="col-12">
                    <label htmlFor="yourUsername" className="form-label">
                      Username
                    </label>
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
                    <div className="form-check">
                      <input
                        className={`form-check-input ${
                          error.rememberMe ? "is-invalid" : ""
                        }`}
                        type="checkbox"
                        name="rememberMe"
                        value="true"
                        id="rememberMe"
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            rememberMe: e.target.checked,
                          })
                        }
                      />
                      <label className="form-check-label" htmlFor="rememberMe">
                        Ingat sesi masuk
                      </label>
                      {error.rememberMe && (
                        <p className="invalid-feedback">{error.rememberMe}</p>
                      )}
                    </div>
                  </div>
                  <div className="col-12">
                    <button className="btn btn-success w-100" type="submit">
                      Masuk
                    </button>
                  </div>
                  <div className="col-12">
                    <p className="small mb-0">
                      Belum memiliki akun? <Link to="/register">Buat Akun</Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;