import React from "react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="container col-xl-9 px-4 py-5">
      <div className="row flex-lg-row-reverse align-items-center g-5 py-5">
        <div className="col-10 col-sm-8 col-lg-6">
          <img
            src="assets/img/logo-DutaKu.png"
            className="img-fluid"
            alt="Logo Duta Indonesia"
          />
        </div>
        <div className="col-lg-6">
          <h1 className="display-5 fw-bold lh-1 mb-3">DutaKu Sleman</h1>
          <p className="lead">
            Selamat datang di Sistem Pendukung Keputusan Pemilihan Dimas Diajeng
            Kabupaten Sleman
          </p>
          <div className="d-grid gap-2 d-md-flex justify-content-md-start">
            <Link to="/login"
              type="button"
              className="btn btn-success btn-md px-4 me-md-2"
            >
              Masuk
            </Link>
            <Link to="/register"
              type="button"
              className="btn btn-success btn-md px-4 me-md-2"
            >
              Daftar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;