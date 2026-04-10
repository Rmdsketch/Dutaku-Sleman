# Dutaku Sleman App

<img src="/frontend/public/assets/img/logo-DutaKu.png" alt="Logo DutaKu" height="50" />

## 📌 Tentang Projek
Dutaku Sleman adalah platform aplikasi yang dirancang untuk memfasilitasi mekanisme seleksi Duta Pariwisata di Kabupaten Sleman. Dikembangkan dengan teknologi modern untuk memberdayakan Dinas Pariwisata Kabupaten Sleman dalam mengelola, memantau, mengevaluasi kandidat duta (alternatif), memastikan proses analisis yang jelas, objektif, dan transparan dengan menggunakan matriks pengurutan metode SAW (Simple Additive Weighting).

## 💻 Teknologi yang digunakan

<div align="left">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=react,vite,bootstrap,flask,python,mysql,vercel" alt="Tech Stack Icons" />
  </a>
</div>

*Frontend dideploy di Vercel, Backend dihosting di PythonAnywhere.*

## 📂 Struktur Project
```text
Dutaku-sleman/
├── backend/                 
│   ├── app.py                
│   ├── auth.py               
│   ├── config.py            
│   ├── limiter.py           
│   ├── routes.py             
│   ├── requirements.txt     
│   ├── models/               
│   ├── resources/            
│   └── schemas/              
└── frontend/                
    ├── public/
    │   └── assets/img/       
    ├── src/
    │   ├── components/       
    │   ├── pages/            
    │   ├── App.jsx           
    │   ├── index.css         
    │   └── main.jsx          
    ├── package.json         
    ├── index.html           
    └── vite.config.js       
```

### Persyaratan Sistem
* **Node.js** & **npm**  
  ```sh
  npm install npm@latest -g
  ```
* **Python 3**  

### 1. Instalasi
Clone the repository:
```sh
git clone https://github.com/Rmdsketch/Dutaku-sleman.git
cd Dutaku-sleman
```

### 2. Setup Backend
Buat virtual environment, install depedensi, dan jalankan server pada port 5000:
```sh
cd backend
python -m venv .venv
source .venv/bin/activate 
pip install -r requirements.txt
python app.py
```

### 3. Setup Frontend
Install depedensi dan jalankan frontend pada port 5173:
```sh
cd ../frontend
npm install
npm run dev
```

## 📸 Tampilan Aplikasi

**1. Halaman Utama**  
Halaman pengantar yang memperkenalkan platform aplikasi Dutaku Sleman.
<div align="left">
  <img src="/frontend/public/assets/img/Screenshot%20from%202026-04-10%2008-38-45.png" alt="Halaman Utama bagian 1" width="32%"/>
  <img src="/frontend/public/assets/img/Screenshot%20from%202026-04-10%2008-38-57.png" alt="Halaman Utama bagian 2" width="32%"/>
  <img src="/frontend/public/assets/img/Screenshot%20from%202026-04-10%2008-39-03.png" alt="Halaman Utama bagian 3" width="32%"/>
</div>

<br/>

**2. Halaman Login**  
Halaman masuk untuk administrator ataupun juri.
![Halaman Login](/frontend/public/assets/img/Screenshot%20from%202026-04-10%2008-39-15.png)

<br/>

**3. Halaman Register**  
Halaman untuk mendaftarkan akun baru bagi administrator maupun juri.
![Halaman Register](/frontend/public/assets/img/Screenshot%20from%202026-04-10%2008-39-22.png)

<br/>

**4. Halaman Dashboard**  
Halaman pusat informasi yang menampilkan ringkasan data dan statistik seleksi.
<div align="left">
  <img src="/frontend/public/assets/img/Screenshot%20from%202026-04-10%2008-21-08.png" alt="Halaman Dashboard bagian 1" width="49%"/>
  <img src="/frontend/public/assets/img/Screenshot%20from%202026-04-10%2008-21-16.png" alt="Halaman Dashboard bagian 2" width="49%"/>
</div>

<br/>

**5. Halaman Kriteria**  
Halaman untuk mengelola kriteria penilaian, bobot, dan jenis parameter seleksi.
<div align="left">
  <img src="/frontend/public/assets/img/Screenshot%20from%202026-04-10%2008-21-28.png" alt="Halaman Kriteria bagian 1" width="49%"/>
  <img src="/frontend/public/assets/img/Screenshot%20from%202026-04-10%2008-21-36.png" alt="Halaman Kriteria bagian 2" width="49%"/>
</div>

<br/>

**6. Halaman Alternatif**  
Halaman untuk mengelola data peserta seleksi kategori Dimas dan Diajeng.
![Halaman Alternatif](/frontend/public/assets/img/Screenshot%20from%202026-04-10%2014-42-23.png)
<br/>

**7. Halaman Perhitungan dan Hasil**  
Halaman untuk melihat proses hitungan metode SAW dan hasil peringkat akhir.
<div align="left">
  <img src="/frontend/public/assets/img/Screenshot%20from%202026-04-10%2008-21-45.png" alt="Halaman Perhitungan bagian 1" width="32%"/>
  <img src="/frontend/public/assets/img/Screenshot%20from%202026-04-10%2008-21-54.png" alt="Halaman Perhitungan bagian 2" width="32%"/>
  <img src="/frontend/public/assets/img/Screenshot%20from%202026-04-10%2008-22-00.png" alt="Halaman Perhitungan bagian 3" width="32%"/>
  <img src="/frontend/public/assets/img/Screenshot%20from%202026-04-10%2008-22-21.png" alt="Halaman Hasil bagian 1" width="32%"/>
  <img src="/frontend/public/assets/img/Screenshot%20from%202026-04-10%2008-22-27.png" alt="Halaman Hasil bagian 2" width="32%"/>
</div>
