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
  const [showPassword, setShowPassword] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    const userRole =
      localStorage.getItem("userRole") || sessionStorage.getItem("userRole");
    if (token && userRole) {
      navigate("/homepage");
    }
  }, [navigate]);

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
        // "http://localhost:5000/auth/login",
        "https://rmdsketch.pythonanywhere.com/auth/login",
        formData
      );

      const { token, username, role } = response.data;
      if (formData.rememberMe) {
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

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className={`auth-page ${isReady ? "is-ready" : ""}`}>
      <div className="auth-aurora aurora-one" aria-hidden="true"></div>
      <div className="auth-aurora aurora-two" aria-hidden="true"></div>
      <div className="auth-aurora aurora-three" aria-hidden="true"></div>
      <div className="auth-grid-overlay" aria-hidden="true"></div>
      <section className="auth-wrapper d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '100vh', padding: '2rem 1rem' }}>
        <div className="mb-4 d-flex align-items-center justify-content-center gap-2">
          <img src="assets/img/icon-DutaKu.png" alt="DutaKu Icon" style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
          <div className="text-start">
            <h4 className="mb-0 fw-bold" style={{ color: '#111827', fontSize: '20px' }}>DutaKu Sleman</h4>
          </div>
        </div>

        <div className="auth-panel card shadow-sm w-100" style={{ maxWidth: '450px' }}>
          <div className="card-body p-4 p-md-5">
            <div className="text-center mb-4">
              <h4 className="fw-bold mb-1" style={{ color: '#111827' }}>Masuk ke Akun</h4>
            </div>

            <form className="auth-form" noValidate onSubmit={handleSubmit}>
              <div>
                <label htmlFor="yourUsername" className="form-label font-weight-bold" style={{ fontWeight: 600, fontSize: '14px', color: '#111827' }}>
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
                    placeholder="Masukkan username"
                  />
                </div>
                {error.username && (
                  <p className="invalid-feedback d-block">{error.username}</p>
                )}
              </div>

              <div>
                <label htmlFor="yourPassword" className="form-label" style={{ fontWeight: 600, fontSize: '14px', color: '#111827' }}>
                  Password
                </label>
                <div className={`control-surface password ${error.password ? "has-error" : ""}`}>
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
                    aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
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

              <div className="remember-row">
                <div className="form-check">
                  <input
                    className={`form-check-input ${error.rememberMe ? "is-invalid" : ""}`}
                    type="checkbox"
                    name="rememberMe"
                    id="rememberMe"
                    checked={formData.rememberMe}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        rememberMe: e.target.checked,
                      })
                    }
                  />
                  <label className="form-check-label text-muted" style={{ fontSize: '14px' }} htmlFor="rememberMe">
                    Ingat sesi masuk
                  </label>
                </div>
              </div>
              {error.rememberMe && (
                <p className="invalid-feedback d-block mt-0 mb-3">{error.rememberMe}</p>
              )}

              <button className="btn auth-btn w-100" type="submit">
                Masuk
              </button>

              <div className="text-center mt-2">
                <span className="small text-muted me-1">Belum punya akun?</span>
                <Link to="/register" className="small" style={{ color: 'var(--auth-accent)', fontWeight: 600, textDecoration: 'none' }}>Daftar</Link>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
