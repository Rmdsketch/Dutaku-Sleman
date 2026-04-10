import React, { useState, useEffect } from "react";
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
  const [showPassword, setShowPassword] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => setIsReady(true), 150);
    return () => clearTimeout(timeout);
  }, []);

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

    const invalidInput = {};
    if (!formData.username) {
      invalidInput.username = "Masukkan username di sini!";
    }
    if (!formData.email) {
      invalidInput.email = "Masukkan email valid di sini!";
    }
    if (!formData.password) {
      invalidInput.password = "Masukkan password di sini!";
    }
    if (!formData.role) {
      invalidInput.role = "Pilih salah satu role!";
    }
    if (!formData.terms) {
      invalidInput.terms = "Anda harus menyetujui syarat dan ketentuan!";
    }
    if (Object.keys(invalidInput).length > 0) {
      setError(invalidInput);
      return;
    }

    const { terms, ...submitData } = formData;
    try {
      const response = await axios.post(
        // "http://localhost:5000/auth/register",
        "https://rmdsketch.pythonanywhere.com/auth/register",
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
          ...invalidInput,
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

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className={`auth-page ${isReady ? "is-ready" : ""}`}>
      <div className="auth-aurora aurora-one" aria-hidden="true"></div>
      <div className="auth-aurora aurora-two" aria-hidden="true"></div>
      <div className="auth-aurora aurora-three" aria-hidden="true"></div>
      <div className="auth-grid-overlay" aria-hidden="true"></div>
      <section className="auth-wrapper d-flex flex-column align-items-center justify-content-center">
        <div className="mb-4 d-flex align-items-center justify-content-center gap-2">
          <img src="assets/img/icon-DutaKu.png" alt="DutaKu Icon" className="auth-logo" />
          <div className="text-start">
            <h4 className="mb-0 fw-bold auth-brand-title">DutaKu Sleman</h4>
          </div>
        </div>

        <div className="auth-panel card shadow-sm w-100">
          <div className="card-body p-4 p-md-5">
            <div className="text-center mb-4">
              <h4 className="fw-bold mb-1 auth-title">Buat Akun Baru</h4>
            </div>

            <form className="auth-form" noValidate onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-6">
                  <label htmlFor="yourUsername" className="form-label auth-label">
                    Username
                  </label>
                  <div className="control-surface">
                    <input
                      type="text"
                      name="username"
                      className={`form-control ${error.username ? "is-invalid" : ""}`}
                      id="yourUsername"
                      required
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Masukan username"
                    />
                  </div>
                  {error.username && (
                    <p className="invalid-feedback d-block">{error.username}</p>
                  )}
                </div>

                <div className="col-6">
                  <label htmlFor="yourEmail" className="form-label auth-label">
                    Email
                  </label>
                  <div className="control-surface has-addon">
                    <span className="input-addon">@</span>
                    <input
                      type="email"
                      name="email"
                      className={`form-control ${error.email ? "is-invalid" : ""}`}
                      id="yourEmail"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Masukkan email aktif"
                    />
                  </div>
                  {error.email && (
                    <p className="invalid-feedback d-block">{error.email}</p>
                  )}
                </div>

                <div className="col-6">
                  <label htmlFor="yourPassword" className="form-label auth-label">
                    Password
                  </label>
                  <div
                    className={`control-surface password ${error.password ? "has-error" : ""}`}
                  >
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      className="form-control"
                      id="yourPassword"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      className="toggle-visibility"
                      onClick={togglePasswordVisibility}
                      aria-label={
                        showPassword ? "Sembunyikan password" : "Tampilkan password"
                      }
                    >
                      <i
                        className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
                        aria-hidden="true"
                      ></i>
                    </button>
                  </div>
                  {error.password && (
                    <p className="invalid-feedback d-block">{error.password}</p>
                  )}
                </div>

                <div className="col-6">
                  <label htmlFor="role" className="form-label auth-label">
                    Role
                  </label>
                  <div className="control-surface">
                    <select
                      id="role"
                      name="role"
                      className={`form-select ${error.role ? "is-invalid" : ""}`}
                      value={formData.role}
                      onChange={handleChange}
                    >
                      <option value="" disabled>
                        Pilih Role
                      </option>
                      <option value="Admin">Admin</option>
                      <option value="Juri">Juri</option>
                    </select>
                  </div>
                  {error.role && (
                    <p className="invalid-feedback d-block">{error.role}</p>
                  )}
                </div>
              </div>

              <div>
                <div className="form-check mt-3 mb-1">
                  <input
                    className={`form-check-input ${error.terms ? "is-invalid" : ""}`}
                    name="terms"
                    type="checkbox"
                    value="true"
                    id="acceptTerms"
                    checked={formData.terms}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        terms: e.target.checked,
                      })
                    }
                  />
                  <label className="form-check-label text-muted auth-terms-label" htmlFor="acceptTerms">
                    Saya setuju dan menerima persyaratan
                  </label>
                </div>
                {error.terms && (
                  <p className="invalid-feedback d-block">{error.terms}</p>
                )}
              </div>

              <button className="btn auth-btn w-100 mt-2" type="submit">Daftar
              </button>

              <div className="text-center mt-2">
                <span className="small text-muted me-1">Sudah punya akun?</span>
                <Link to="/login" className="small auth-link">Masuk</Link>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Register;
