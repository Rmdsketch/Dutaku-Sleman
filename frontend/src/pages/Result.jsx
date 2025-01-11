import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Chart from "react-apexcharts";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

const Result = () => {
  const [preferences, setPreferences] = useState([]);
  const [rankedAlternatives, setRankedAlternatives] = useState([]);
  const [dimasData, setDimasData] = useState({});
  const [diajengData, setDiajengData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/saw");
        setPreferences(response.data.preferences);
        setRankedAlternatives(response.data.rankedAlternatives);

        const dimas = response.data.rankedAlternatives
          .filter((alt) => alt.atribut === "Dimas")
          .map((alt) => ({
            name: alt.nama,
            skor: parseFloat(alt.skor.toFixed(3)),
          }));

        const diajeng = response.data.rankedAlternatives
          .filter((alt) => alt.atribut === "Diajeng")
          .map((alt) => ({
            name: alt.nama,
            skor: parseFloat(alt.skor.toFixed(3)),
          }));

        setDimasData({
          series: dimas.map((item) => item.skor),
          options: {
            chart: {
              type: "pie",
            },
            labels: dimas.map((item) => item.name),
            title: {
              text: "Hasil Perangkingan Dimas",
              align: "center",
            },
          },
        });

        setDiajengData({
          series: diajeng.map((item) => item.skor),
          options: {
            chart: {
              type: "pie",
            },
            labels: diajeng.map((item) => item.name),
            title: {
              text: "Hasil Perangkingan Diajeng",
              align: "center",
            },
          },
        });
      } catch (error) {
        console.error("Error memuat data:", error);
      }
    };

    fetchData();
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
                <Link to="/result">Hasil</Link>
              </li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Nilai Preferensi</h5>
              <div className="table-responsive">
                <table className="table table-striped mb-0">
                  <thead>
                    <tr className="table-success">
                      <th className="text-center">Alternatif</th>
                      <th className="text-center">Nilai Preferensi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(preferences).map(([altId, score]) => (
                      <tr key={altId}>
                        <td className="text-center">{altId}</td>
                        <td className="text-center">{score.toFixed(3)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h5 className="card-title mt-4">Hasil Perangkingan</h5>
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr className="table-success">
                      <th>Peringkat</th>
                      <th>Alternatif</th>
                      <th>Nama</th>
                      <th>Atribut</th>
                      <th className="text-center">Skor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rankedAlternatives.map((alt, i) => (
                      <tr key={alt.id}>
                        <td>{i + 1}</td>
                        <td>{alt.id}</td>
                        <td>{alt.nama}</td>
                        <td>{alt.atribut}</td>
                        <td className="text-center">{alt.skor.toFixed(3)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {dimasData.series && (
              <div className="chart-container">
                <Chart
                  options={dimasData.options}
                  series={dimasData.series}
                  type="pie"
                  height={350}
                />
              </div>
            )}

            {diajengData.series && (
              <div className="chart-container">
                <Chart
                  options={diajengData.options}
                  series={diajengData.series}
                  type="pie"
                  height={350}
                />
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Result;