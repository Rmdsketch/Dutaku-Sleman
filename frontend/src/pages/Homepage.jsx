import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

const Homepage = () => {
  const [stats, setStats] = useState({
    criteria: 0,
    alternatives: 0,
    dimas: 0,
    diajeng: 0,
  });
  const [ranking, setRanking] = useState([]);
  const [topCandidates, setTopCandidates] = useState([]);
  const [rankingSummary, setRankingSummary] = useState([]);
  const [loadingRanking, setLoadingRanking] = useState(false);

  const getAuthConfig = () => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (!token) {
      console.error("Token tidak ditemukan, silakan login kembali.");
      return null;
    }

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const fetchStats = async () => {
    const config = getAuthConfig();
    if (!config) return;

    try {
      const [criteriaRes, alternativeRes] = await Promise.all([
        // axios.get("http://localhost:5000/criterias", config),
        axios.get("https://rmdsketch.pythonanywhere.com/criterias", config),
        // axios.get("http://localhost:5000/alternatives", config),
        axios.get("https://rmdsketch.pythonanywhere.com/alternatives", config),
      ]);

      const alternatives = alternativeRes.data || [];
      const dimas = alternatives.filter(
        (alt) => alt.attribute?.toLowerCase() === "dimas"
      ).length;
      const diajeng = alternatives.filter(
        (alt) => alt.attribute?.toLowerCase() === "diajeng"
      ).length;

      setStats({
        criteria: criteriaRes.data?.length || 0,
        alternatives: alternatives.length,
        dimas,
        diajeng,
      });
    } catch (error) {
      console.error("Gagal memuat statistik dashboard", error);
    }
  };

  const fetchRanking = async () => {
    const config = getAuthConfig();
    if (!config) return;

    setLoadingRanking(true);
    try {
      const response = await axios.get(
        // "http://localhost:5000/saw",
        "https://rmdsketch.pythonanywhere.com/saw",
        config);
      const rankedAlternatives = response.data.rankedAlternatives || [];

      setRanking(rankedAlternatives);

      // ambil top kandidat (top Dimas dan top Diajeng)
      const topDimas = rankedAlternatives.find(
        (alt) => alt.attribute?.toLowerCase() === "dimas"
      );
      const topDiajeng = rankedAlternatives.find(
        (alt) => alt.attribute?.toLowerCase() === "diajeng"
      );

      const tops = [];
      if (topDimas) {
        tops.push({
          ...topDimas,
          rank: rankedAlternatives.findIndex((item) => item.id === topDimas.id) + 1,
          badgeColor: "mint",
        });
      }
      if (topDiajeng) {
        tops.push({
          ...topDiajeng,
          rank: rankedAlternatives.findIndex((item) => item.id === topDiajeng.id) + 1,
          badgeColor: "gold",
        });
      }
      setTopCandidates(tops);

      // ambil top 5 untuk ringkasan peringkat
      const topFive = rankedAlternatives.slice(0, 5).map((alt, index) => ({
        ...alt,
        rank: index + 1,
      }));
      setRankingSummary(topFive);
    } catch (error) {
      console.error("Gagal memuat data perangkingan", error);
    } finally {
      setLoadingRanking(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchRanking();
    document.body.classList.add("toggle-sidebar");
    return () => {
      document.body.classList.remove("toggle-sidebar");
    };
  }, []);

  const summaryCards = [
    {
      label: "Total Kriteria",
      value: stats.criteria,
      icon: "bi bi-list-check",
      color: "green",
    },
    {
      label: "Total Alternatif",
      value: stats.alternatives,
      icon: "bi bi-people-fill",
      color: "purple",
    },
    {
      label: "Kandidat Dimas",
      value: stats.dimas,
      icon: "bi bi-calculator",
      color: "blue",
    },
    {
      label: "Kandidat Diajeng",
      value: stats.diajeng,
      icon: "bi bi-trophy",
      color: "orange",
    },
  ];

  const gallerySlides = [
    {
      src: "assets/img/dimas-diajeng-sleman.png",
      title: "Finalis Dimas Diajeng Sleman",
      caption: "Sesi pemotretan resmi menjelang malam penganugerahan.",
    },
    {
      src: "assets/img/dimas-diajeng-sleman2.png",
      title: "Edufair & Sosialisasi",
      caption: "Perkenalan kandidat kepada publik dan media lokal.",
    },
    {
      src: "assets/img/dimas-diajeng-sleman3.png",
      title: "Penilaian Kriteria",
      caption: "Tahap wawancara, modelling, dan public speaking.",
    },
  ];

  return (
    <div className="dashboard-shell">
      <Header />
      <Sidebar />
      <main id="main" className="main dashboard-main">
        <div className="dashboard-content">
          <div className="dashboard-header">
            <div className="breadcrumb-simple">
              <Link to="/homepage">Home</Link>
              <span>/</span>
              <span className="breadcrumb-current">Dashboard</span>
            </div>
            <h1>Dashboard</h1>
            <p>
              Sistem Pendukung Keputusan Pemilihan Dimas Diajeng Sleman membantu
              panitia melakukan penilaian transparan menggunakan metode Simple
              Additive Weighting (SAW).
            </p>
          </div>

          <section className="metrics-grid">
            {summaryCards.map((card) => (
              <article
                className={`metrics-card ${card.color}`}
                key={card.label}
              >
                <div className="metric-icon">
                  <i className={card.icon}></i>
                </div>
                <div className="metric-info">
                  <p className="metric-label">{card.label}</p>
                  <p className="metric-value">{card.value}</p>
                </div>
              </article>
            ))}
          </section>

          <section className="dashboard-panel">
            <h3>Tentang DutaKu Sleman</h3>
            <p>
              <strong>DutaKu Sleman</strong> merupakan platform SPK yang
              dikembangkan untuk meningkatkan objektivitas penilaian dalam
              memilih Dimas dan Diajeng terbaik Kabupaten Sleman. Sistem ini
              memudahkan juri memonitor kriteria, bobot, dan pencapaian kandidat
              dalam satu layar.
            </p>
            <p>
              Dengan antarmuka yang ringkas, data kandidat dapat dibandingkan
              secara real time sehingga setiap keputusan dapat dipertanggung
              jawabkan. Visualisasi ringkasan di atas membantu juri mengetahui
              kemajuan proses seleksi secara cepat.
            </p>
            <div className="panel-highlight">
              <span>Metode</span>
              <p>
                Proses perhitungan memanfaatkan{" "}
                <strong>Simple Additive Weighting</strong> agar bobot antar
                kriteria dapat digabungkan secara konsisten.
              </p>
            </div>
            <section className="dashboard-gallery">
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                navigation
                pagination={{ clickable: true }}
                spaceBetween={24}
                slidesPerView={1}
                autoplay={{
                  delay: 5000,
                  disableOnInteraction: false,
                }}
              >
                {gallerySlides.map((slide) => (
                  <SwiperSlide key={slide.src}>
                    <figure className="gallery-slide">
                      <img src={slide.src} alt={slide.title} />
                      <figcaption>
                        <strong>{slide.title}</strong>
                        <span>{slide.caption}</span>
                      </figcaption>
                    </figure>
                  </SwiperSlide>
                ))}
              </Swiper>
            </section>
          </section>

          <section className="top-candidates">
            <h3>Top Kandidat</h3>
            <div className="candidate-list">
              {loadingRanking ? (
                <p className="text-center">Memuat data...</p>
              ) : topCandidates.length > 0 ? (
                topCandidates.map((candidate) => (
                  <article className="candidate-card" key={candidate.id}>
                    <div className={`candidate-avatar ${candidate.attribute?.toLowerCase()}`}>
                      <i className="bi bi-trophy"></i>
                    </div>
                    <div className="candidate-info">
                      <p className="candidate-name">{candidate.name}</p>
                      <p className="candidate-meta">
                        {candidate.attribute || candidate.category} — Skor {candidate.score?.toFixed(3)}
                      </p>
                    </div>
                    <span className={`candidate-rank ${candidate.badgeColor}`}>
                      #{candidate.rank}
                    </span>
                  </article>
                ))
              ) : (
                <p className="text-center text-muted">Belum ada data perangkingan tersedia.</p>
              )}
            </div>
          </section>

          <section className="ranking-summary">
            <h3>Ringkasan Peringkat</h3>
            <div className="table-responsive ranking-table-wrapper">
              <table className="table ranking-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Kode</th>
                    <th>Nama</th>
                    <th>Kategori</th>
                    <th>Skor</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingRanking ? (
                    <tr>
                      <td colSpan="5" className="text-center">Memuat data...</td>
                    </tr>
                  ) : rankingSummary.length > 0 ? (
                    rankingSummary.map((item, index) => (
                      <tr key={item.id}>
                        <td>{index + 1}</td>
                        <td>{item.id}</td>
                        <td>{item.name}</td>
                        <td>
                          <span className={`badge-pill ${item.attribute?.toLowerCase()}`}>
                            {item.attribute}
                          </span>
                        </td>
                        <td>{item.score?.toFixed(3)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center text-muted">
                        Belum ada data perangkingan tersedia.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Homepage;
