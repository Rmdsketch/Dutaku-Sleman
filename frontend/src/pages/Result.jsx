import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Chart from "react-apexcharts";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

const Result = () => {
  const [preferences, setPreferences] = useState({});
  const [rankedAlternatives, setRankedAlternatives] = useState([]);
  const [filter, setFilter] = useState("all");

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = getAuthConfig();
        if (!config) return;
        const response = await axios.get(
          // "http://localhost:5000/saw", 
          "https://rmdsketch.pythonanywhere.com/saw",
          config);
        setPreferences(response.data.preferences || {});
        setRankedAlternatives(response.data.rankedAlternatives || []);
      } catch (error) {
        console.error("Error memuat data:", error);
      }
    };

    fetchData();
  }, []);

  const filteredAlternatives = useMemo(() => {
    if (filter === "all") return rankedAlternatives;
    return rankedAlternatives.filter(
      (alt) => alt.attribute?.toLowerCase() === filter
    );
  }, [filter, rankedAlternatives]);

  const dimasList = useMemo(
    () => rankedAlternatives.filter((alt) => alt.attribute?.toLowerCase() === "dimas"),
    [rankedAlternatives]
  );

  const diajengList = useMemo(
    () => rankedAlternatives.filter((alt) => alt.attribute?.toLowerCase() === "diajeng"),
    [rankedAlternatives]
  );

  const buildChartConfig = (data, palette) => ({
    series: [
      {
        name: "Skor",
        data: data.map((item) => Number((item.score ?? 0).toFixed(3))),
      },
    ],
    options: {
      chart: { type: "bar", toolbar: { show: false } },
      plotOptions: {
        bar: {
          horizontal: true,
          distributed: true,
          barHeight: "60%",
        },
      },
      colors: palette,
      xaxis: {
        categories: data.map(
          (item) => `${item.name} (${item.id})`
        ),
        title: { text: "Skor" },
        labels: {
          formatter: (val) => Number(val).toFixed(3),
        },
      },
      yaxis: {
        labels: {
          style: { fontSize: "12px" },
        },
      },
      dataLabels: {
        enabled: true,
        formatter: (val) => Number(val).toFixed(3),
        style: { fontSize: "11px" },
        offsetX: -10,
      },
      tooltip: {
        y: {
          formatter: (value, { dataPointIndex }) =>
            `${data[dataPointIndex]?.name ?? ""}: ${Number(value).toFixed(3)}`,
        },
      },
      legend: { show: false },
      responsive: [
        {
          breakpoint: 768,
          options: {
            plotOptions: { bar: { barHeight: "80%" } },
            chart: { height: 360 },
            dataLabels: { offsetX: -6 },
            xaxis: {
              labels: { show: false },
              title: { text: "" }
            }
          },
        },
      ],
    },
  });

  const dimasChart = useMemo(
    () =>
      buildChartConfig(dimasList, [
        "#0EA5E9",
        "#34D399",
        "#2563EB",
        "#9333EA",
        "#14B8A6",
        "#F59E0B",
        "#EF4444",
        "#10B981",
        "#3B82F6",
        "#8B5CF6",
      ]),
    [dimasList]
  );
  const diajengChart = useMemo(
    () =>
      buildChartConfig(diajengList, [
        "#F97316",
        "#E11D48",
        "#A855F7",
        "#10B981",
        "#FACC15",
        "#EC4899",
        "#6366F1",
        "#22C55E",
        "#FB923C",
        "#F472B6",
      ]),
    [diajengList]
  );

  const getRank = (id) =>
    rankedAlternatives.findIndex((item) => item.id === id) + 1;

  const topDimas = rankedAlternatives.find(
    (alt) => alt.attribute?.toLowerCase() === "dimas"
  );
  const topDiajeng = rankedAlternatives.find(
    (alt) => alt.attribute?.toLowerCase() === "diajeng"
  );

  const filterOptions = [
    { label: "Semua", value: "all" },
    { label: "Dimas", value: "dimas" },
    { label: "Diajeng", value: "diajeng" },
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
              <span className="breadcrumb-current">Hasil</span>
            </div>
            <h1>Hasil Perangkingan</h1>
            <p>
              Hasil akhir perhitungan metode SAW untuk seleksi Dimas Diajeng
              Kabupaten Sleman.
            </p>
          </div>

          <div className="winner-grid">
            <article className="winner-card dimas">
              <p className="winner-label">
                <i className="bi bi-trophy me-2"></i>Dimas Terpilih
              </p>
              {topDimas ? (
                <>
                  <h3>{topDimas.name}</h3>
                  <p className="winner-meta">
                    {topDimas.id} — Skor {topDimas.score.toFixed(3)}
                  </p>
                </>
              ) : (
                <p className="winner-meta">Belum ada data Dimas.</p>
              )}
            </article>

            <article className="winner-card diajeng">
              <p className="winner-label">
                <i className="bi bi-trophy me-2"></i>Diajeng Terpilih
              </p>
              {topDiajeng ? (
                <>
                  <h3>{topDiajeng.name}</h3>
                  <p className="winner-meta">
                    {topDiajeng.id} — Skor {topDiajeng.score.toFixed(3)}
                  </p>
                </>
              ) : (
                <p className="winner-meta">Belum ada data Diajeng.</p>
              )}
            </article>
          </div>

          <div className="chip-group">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`chip ${filter === option.value ? "active" : ""}`}
                onClick={() => setFilter(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>

          <section className="ranking-summary">
            <h3>Perangkingan Keseluruhan</h3>
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
                  {filteredAlternatives.length > 0 ? (
                    filteredAlternatives.map((alt) => (
                      <tr key={alt.id}>
                        <td>
                          <span className="rank-pill">{getRank(alt.id)}</span>
                        </td>
                        <td>{alt.id}</td>
                        <td>{alt.name}</td>
                        <td>
                          <span
                            className={`badge-pill ${alt.attribute?.toLowerCase()}`}
                          >
                            {alt.attribute}
                          </span>
                        </td>
                        <td>{alt.score?.toFixed(3)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center">
                        Tidak ada data untuk filter ini.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="score-chart-grid">
            <article className="table-card chart-card dimas-chart">
              <div className="table-header">
                <h3>Grafik Skor Dimas</h3>
              </div>
              <div className="chart-wrapper">
                {dimasList.length > 0 ? (
                  <Chart
                    options={dimasChart.options}
                    series={dimasChart.series}
                    type="bar"
                    height={dimasList.length * 45 + 120}
                  />
                ) : (
                  <p className="text-center mb-0">Belum ada data Dimas.</p>
                )}
              </div>
            </article>

            <article className="table-card chart-card diajeng-chart">
              <div className="table-header">
                <h3>Grafik Skor Diajeng</h3>
              </div>
              <div className="chart-wrapper">
                {diajengList.length > 0 ? (
                  <Chart
                    options={diajengChart.options}
                    series={diajengChart.series}
                    type="bar"
                    height={diajengList.length * 45 + 120}
                  />
                ) : (
                  <p className="text-center mb-0">Belum ada data Diajeng.</p>
                )}
              </div>
            </article>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Result;
