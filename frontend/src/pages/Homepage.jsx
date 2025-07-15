import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

const Homepage = () => {
  return (
    <div>
      <Header />
      <Sidebar />
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>
            Sistem Pendukung Keputusan Pemilihan Dimas Diajeng Kabupaten Sleman
          </h1>
        </div>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/homepage">Home</Link>
            </li>
            <li className="breadcrumb-item active">
              <Link to="">Dashboard</Link>
            </li>
          </ol>
        </nav>
        <div className="card">
          <ul
            className="nav nav-tabs nav-tabs-bordered d-flex"
            id="borderedTabJustified"
            role="tablist"
          >
            <li className="nav-item flex-fill" role="presentation">
              <button
                className="nav-link w-100 active"
                id="dutaku-tab"
                data-bs-toggle="tab"
                data-bs-target="#bordered-justified-dutaku"
                type="button"
                role="tab"
                aria-controls="bordered-justified-dutaku"
                aria-selected="true"
              >
                <i className="fa-solid fa-book-open me-2"></i>Tentang DutaKu
              </button>
            </li>
            <li className="nav-item flex-fill" role="presentation">
              <button
                className="nav-link w-100"
                id="latar-belakang-tab"
                data-bs-toggle="tab"
                data-bs-target="#bordered-justified-latar-belakang"
                type="button"
                role="tab"
                aria-controls="bordered-justified-latar-belakang"
                aria-selected="false"
              >
                <i className="fa-solid fa-landmark me-2"></i>Latar Belakang
              </button>
            </li>
            <li className="nav-item flex-fill" role="presentation">
              <button
                className="nav-link w-100"
                id="info-tab"
                data-bs-toggle="tab"
                data-bs-target="#bordered-justified-info"
                type="button"
                role="tab"
                aria-controls="bordered-justified-info"
                aria-selected="false"
              >
                <i className="fa-solid fa-info-circle me-2"></i>Info DutaKu
              </button>
            </li>
          </ul>
          <div className="tab-content card-body">
            <div
              className="tab-pane fade show active"
              id="bordered-justified-dutaku"
              role="tabpanel"
              aria-labelledby="dutaku-tab"
            >
              <h5 className="card-title">DutaKu Sleman</h5>
              <img
                src="assets/img/dimas-diajeng-sleman.png"
                className="card-img-top"
                alt="Dimas-Diajeng-Sleman"
              />
              <figcaption className="text-muted text-center mt-2">
                <i>Contoh Foto Dimas Diajeng Kabupaten Sleman</i>
                <br />
                <i>Sumber: PjBL - DutaKu Sleman</i>
              </figcaption>
              <p className="card-text">
                Sistem Pendukung Keputusan Pemilihan Dimas Diajeng Sleman (
                <strong>DutaKu Sleman</strong>) dikembangkan sebagai solusi
                inovatif untuk meningkatkan transparansi dan objektivitas dalam
                proses seleksi duta wisata. Sistem ini memanfaatkan teknologi
                terkini untuk membantu panitia seleksi dalam menentukan kandidat
                terbaik yang dapat merepresentasikan Kabupaten Sleman sebagai
                ikon pariwisata.
              </p>
              <p className="card-text">
                SPK ini dibuat untuk mendukung proses seleksi yang adil dan
                transparan. Dengan hadirnya <strong>DutaKu Sleman</strong>,
                proses seleksi menjadi lebih efektif dan efisien, serta mampu
                menghasilkan duta wisata berkualitas yang berperan dalam
                memajukan pariwisata Sleman di tingkat nasional maupun
                internasional.
              </p>
            </div>
            <div
              className="tab-pane fade"
              id="bordered-justified-latar-belakang"
              role="tabpanel"
              aria-labelledby="latar-belakang-tab"
            >
              <h5 className="card-title">Latar Belakang</h5>
              <img
                src="assets/img/dimas-diajeng-sleman2.png"
                className="card-img-top"
                alt="Dimas-Diajeng-Sleman"
              />
              <figcaption className="text-muted text-center mt-2">
                <i>Contoh Foto Dimas Diajeng Kabupaten Sleman</i>
                <br />
                <i>Sumber: PjBL - DutaKu Sleman</i>
              </figcaption>
              <p className="card-text">
                Pemilihan Dimas Diajeng Sleman merupakan agenda dua tahunan yang
                diselenggarakan oleh Dinas Pariwisata Kabupaten Sleman, bekerja
                sama dengan Ikatan Dimas Diajeng Sleman (<strong>IDDS</strong>).
                Kegiatan ini bertujuan untuk memberikan pengetahuan dan wawasan
                kepada generasi muda mengenai dunia pariwisata dan budaya,
                sehingga dapat menumbuhkan serta memperkuat rasa cinta terhadap
                tanah air dan budaya. Dimas Diajeng Sleman sendiri didirikan
                pada tahun 2009, yang merepresentasikan Dimas Diajeng Sleman
                yaitu <strong>Berkarakter, Peduli dan Berprestasi</strong>.
              </p>
            </div>
            <div
              className="tab-pane fade"
              id="bordered-justified-info"
              role="tabpanel"
              aria-labelledby="info-tab"
            >
              <h5 className="card-title">Kriteria Penilaian</h5>
              <img
                src="assets/img/dimas-diajeng-sleman3.png"
                className="card-img-top"
                alt="Dimas-Diajeng-Sleman"
              />
              <figcaption className="text-muted text-center mt-2">
                <i>Contoh Foto Dimas Diajeng Kabupaten Sleman</i>
                <br />
                <i>Sumber: PjBL - DutaKu Sleman</i>
              </figcaption>
              <ol className="card-text">
                <li>
                  <strong>Wawasan</strong>
                  <p>
                    Kandidat memiliki wawasan yang sangat luas dan mendalam
                    dalam semua aspek (pengetahuan umum, seni budaya,
                    pariwisata, psikologi, dan isu terkini). Mampu memberikan
                    jawaban yang akurat, relevan, inovatif, serta didukung
                    dengan contoh atau data yang kuat.
                  </p>
                </li>
                <li>
                  <strong>Public Speaking</strong>
                  <p>
                    Kandidat menunjukkan kemampuan berbicara yang luar biasa.
                    Penyampaian informasi sangat jelas, percaya diri tinggi,
                    memiliki intonasi dan gestur yang tepat. Mampu menggunakan
                    Bahasa Inggris dan/atau Bahasa Jawa dengan lancar, sesuai
                    konteks, dan dengan pengucapan yang baik.
                  </p>
                </li>
                <li>
                  <strong>Attitude</strong>
                  <p>
                    Kandidat menunjukkan sikap yang sangat sopan, penuh
                    profesionalisme, dan terorganisasi dengan sangat baik. Mampu
                    menghadapi tantangan atau situasi sulit dengan tenang,
                    bijaksana, dan solusi yang efektif. Memberikan kesan positif
                    kepada juri dan audiens dalam setiap interaksi.
                  </p>
                </li>
                <li>
                  <strong>Modelling</strong>
                  <p>
                    Kandidat menunjukkan peragaan yang memukau di atas panggung.
                    Langkah yang elegan, postur tubuh sempurna, ekspresi wajah
                    yang menawan, dan kontak mata yang kuat dengan audiens.
                    Kepercayaan diri sangat tinggi, mencerminkan pengalaman dan
                    penguasaan yang profesional.
                  </p>
                </li>
                <li>
                  <strong>Skill</strong>
                  <p>
                    Kandidat menunjukkan keterampilan yang luar biasa, kreatif,
                    dan relevan dengan perannya. Eksekusi sangat sempurna dengan
                    detail yang mengesankan. Keterampilan tersebut memberikan
                    dampak positif dan menginspirasi audiens atau juri. Kandidat
                    terlihat menguasai keterampilan tersebut dengan sangat baik.
                  </p>
                </li>
              </ol>
              <h5 className="card-title">
                Persyaratan Calon Dimas Diajeng Sleman
              </h5>
              <ol className="card-text">
                <li>Peserta berusia 17 - 24 tahun (saat malam penobatan).</li>
                <li>
                  ⁠Peserta merupakan Penduduk Berkewarganegaraan Indonesia.
                </li>
                <li>
                  Peserta bertempat tinggal di Daerah Istimewa Yogyakarta
                  minimal 2 tahun ketika menjadi finalis.
                </li>
                <li>⁠Peserta sehat jasmani dan rohani.</li>
                <li>⁠Peserta berperilaku baik,sopan, dan santun.</li>
                <li>
                  Peserta mampu berkomunikasi secara menarik, komunikatif ,
                  dinamis dan berkarakter.
                </li>
                <li>
                  Peserta belum pernah menyandang gelar sebagai Duta Wisata
                  daerah lain.
                </li>
                <li>
                  ⁠Peserta wajib mengikuti seluruh kegiatan dalam proses
                  pemilihan Dimas Diajeng Kabupaten Sleman.
                </li>
              </ol>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Homepage;