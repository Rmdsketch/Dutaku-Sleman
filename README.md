
# Dutaku Sleman

![Logo DutaKu](/frontend/public/assets/img/logo-DutaKu.png)

## About The Project

Dutaku Sleman is a web-based application for the selection of Tourism Ambassadors in Sleman Regency. This application was built to assist the Sleman Regency Tourism Office in managing the selection process for Tourism Ambassadors so that it becomes more effective and efficient.

## Author

*   **RMD-SKETCH**

## Tech Stack

*   **Frontend:**
    *   ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
    *   ![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
    *   ![Bootstrap](https://img.shields.io/badge/bootstrap-%238511FA.svg?style=for-the-badge&logo=bootstrap&logoColor=white)
    *   ![ApexCharts](https://img.shields.io/badge/apexcharts-%2300E396.svg?style=for-the-badge&logo=apexcharts&logoColor=white)
    *   ![ECharts](https://img.shields.io/badge/echarts-%23293C55.svg?style=for-the-badge&logo=echarts&logoColor=white)
    *   ![SweetAlert2](https://img.shields.io/badge/sweetalert2-%233085d6.svg?style=for-the-badge&logo=sweetalert2&logoColor=white)
*   **Backend:**
    *   ![Node.js](https://img.shields.io/badge/node.js-%23393.svg?style=for-the-badge&logo=nodedotjs&logoColor=%23339933)
    *   ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=white)
    *   ![MySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white)
*   **Deployment:**
    *   ![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)

## Project Structure

```
. Dutaku-sleman/
├── backend/
│   ├── app.py
│   ├── auth.py
│   ├── config.py
│   ├── routes.py
│   ├── models/
│   │   ├── __init__.py
│   │   ├── alternative.py
│   │   ├── criterion.py
│   │   └── user.py
│   ├── resources/
│   │   ├── __init__.py
│   │   ├── alternative.py
│   │   ├── criterion.py
│   │   └── user.py
│   └── schemas/
│       ├── __init__.py
│       ├── alternative.py
│       ├── criterion.py
│       └── user.py
└── frontend/
    ├── public/
    │   └── assets/
    │       ├── img/
    │       └── vendor/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── .gitignore
    ├── index.html
    ├── package.json
    └── vite.config.js
```

## Getting Started

To get a local copy up and running follow these simple example steps.

### Prerequisites

*   npm
    ```sh
    npm install npm@latest -g
    ```
*   python
    ```sh
    sudo apt-get install python3
    ```

### Installation

1.  Clone the repo
    ```sh
    git clone https://github.com/your_username_/Dutaku-sleman.git
    ```
2.  Install NPM packages
    ```sh
    cd frontend
    npm install
    ```
3.  Install python packages
    ```sh
    cd backend
    pip install -r requirements.txt
    ```

### Running the Application

1.  Start the backend server
    ```sh
    cd backend
    python app.py
    ```
2.  Start the frontend development server
    ```sh
    cd frontend
    npm run dev
    ```

## Contact

Project Link: [https://github.com/your_username_/Dutaku-sleman](https://github.com/your_username_/Dutaku-sleman)
