import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

const Criteria = () => {
  const [crit, setCriteria] = useState([]);

  const fetchCriteria = async () => {
    try {
      const response = await axios.get("http://localhost:5000/criterias");
      setCriteria(response.data);
    } catch (error) {
      console.error("Gagal memuat data, silahkan coba lagi nanti");
    }
  };

  useEffect(() => {
    fetchCriteria();
  }, []);

  return (
    <div>
      <Header />
      <Sidebar />
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>
            Sistem Pendukung Keputusan Pemilihan Dimas Diajeng Kabupaten Sleman
          </h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/homepage">Home</Link>
              </li>
              <li className="breadcrumb-item active">
                <Link to="/criteria">Kriteria</Link>
              </li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row align-items-top">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Tabel Kriteria</h5>
                  <p className="card-text">
                    Kriteria penilaian telah ditetapkan oleh sistem untuk
                    memastikan konsistensi dan akurasi. Anda dapat melihat
                    informasi kriteria yang tersedia sebagai panduan dalam
                    proses penilaian.
                  </p>
                  <div className="table-responsive">
                    <table className="table table-striped">
                      <thead>
                        <tr className="table-success">
                          <th>Kode</th>
                          <th>Kriteria</th>
                          <th>Bobot</th>
                          <th>Atribut</th>
                        </tr>
                      </thead>
                      <tbody>
                        {crit.length > 0 ? (
                          crit.map((crit, i) => (
                            <tr key={i}>
                              <td>{crit.id}</td>
                              <td>{crit.kriteria}</td>
                              <td>{crit.bobot}</td>
                              <td>{crit.atribut}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" className="text-center">
                              Tidak ada data
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Criteria;