import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import "../index.css";

const Landing = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className={`landing-page ${isReady ? "is-ready" : ""}`}>
      <div className="auth-aurora aurora-one" aria-hidden="true"></div>
      <div className="auth-aurora aurora-two" aria-hidden="true"></div>
      <div className="auth-aurora aurora-three" aria-hidden="true"></div>
      <div className="auth-grid-overlay" aria-hidden="true"></div>

      <nav className="landing-nav stagger-1">
        <div className="nav-brand">
          <img src="assets/img/logo-DutaKu.png" alt="Logo DutaKu" className="brand-logo" />
          <div className="brand-text">
            <strong>DutaKu Sleman</strong>
          </div>
        </div>
        <div className="nav-actions">
          <Link to="/login" className="btn-text">Masuk</Link>
          <Link to="/register" className="btn-solid">Daftar</Link>
        </div>
      </nav>

      <main className="landing-main">
        <section className="hero-section text-center stagger-2">
          <div className="pill-badge">
            <i className="bi bi-book"></i> Sistem Pendukung Keputusan
          </div>
          <h1 className="hero-title">
            Sistem Pendukung Keputusan Pemilihan <br />
            <span className="text-emerald">Dimas & Diajeng</span><br />
            Kabupaten Sleman
          </h1>
          <p className="hero-subtitle">
            Platform digital untuk menentukan Duta Budaya Kabupaten Sleman
            menggunakan metode SAW yang transparan dan akurat.
          </p>

          <div className="hero-actions">
            <Link to="/register" className="btn-primary-large">
              Mulai Sekarang <i className="bi bi-arrow-right"></i>
            </Link>
            <Link to="/login" className="btn-outline-large">
              Sudah Punya Akun
            </Link>
          </div>

          <div className="stats-row stagger-3">
            <div className="stat-card">
              <div className="stat-value text-emerald">5+</div>
              <div className="stat-label">Kriteria Penilaian</div>
            </div>
            <div className="stat-card">
              <div className="stat-value text-emerald">SAW</div>
              <div className="stat-label">Metode Perhitungan</div>
            </div>
            <div className="stat-card">
              <div className="stat-value text-emerald">100%</div>
              <div className="stat-label">Akurat & Objektif</div>
            </div>
            <div className="stat-card">
              <div className="stat-value text-emerald">∞</div>
              <div className="stat-label">Kandidat Fleksibel</div>
            </div>
          </div>
        </section>

        <section className="features-section text-center stagger-4">
          <div className="pill-badge purple">
            <i className="bi bi-magic"></i> Fitur Unggulan
          </div>
          <h2 className="section-title">Semua yang Anda Butuhkan</h2>
          <p className="section-subtitle">
            Kelola seluruh proses seleksi dari awal hingga akhir dalam satu platform
            terintegrasi.
          </p>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <i className="bi bi-list-check"></i>
              </div>
              <h4>Manajemen Kriteria</h4>
              <p>Kelola kriteria penilaian secara dinamis dengan bobot yang fleksibel</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="bi bi-people"></i>
              </div>
              <h4>Data Alternatif</h4>
              <p>Input dan kelola data kandidat Dimas & Diajeng dengan mudah</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="bi bi-calculator"></i>
              </div>
              <h4>Metode SAW</h4>
              <p>Perhitungan otomatis menggunakan Simple Additive Weighting</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="bi bi-trophy"></i>
              </div>
              <h4>Hasil Perangkingan</h4>
              <p>Visualisasi hasil ranking lengkap dengan grafik interaktif</p>
            </div>
          </div>
        </section>

        <section className="cta-section stagger-3">
          <div className="cta-card">
            <div className="cta-icon">
              <i className="bi bi-shield-check"></i>
            </div>
            <h2>Siap Memulai Seleksi?</h2>
            <p>
              Daftarkan diri Anda dan mulai kelola proses pemilihan Dimas & Diajeng
              Sleman secara digital.
            </p>
            <Link to="/register" className="btn-cta">
              Daftar Gratis <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
};

export default Landing;