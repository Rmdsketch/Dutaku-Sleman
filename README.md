# Dutaku Sleman

![Logo DutaKu](/frontend/public/assets/img/logo-DutaKu.png)

## About The Project

Dutaku Sleman is a web-based application for the selection of Tourism Ambassadors in Sleman Regency. This application was built to assist the Sleman Regency Tourism Office in managing the selection process for Tourism Ambassadors so that it becomes more effective and efficient.

## Author

*   **Muhamad Ramadani**

## Tech Stack

*   **Frontend:**
    *   ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
    *   ![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
    *   ![Bootstrap](https://img.shields.io/badge/bootstrap-%238511FA.svg?style=for-the-badge&logo=bootstrap&logoColor=white)

*   **Backend:**
    *   ![Flask](https://img.shields.io/badge/flask-%23000.svg?style=for-the-badge&logo=flask&logoColor=white)
    *   ![Python](https://img.shields.io/badge/python-3776AB?style=for-the-badge&logo=python&logoColor=white)
    *   ![MySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white)
*   **Deployment:**
    *   ![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)
    *   ![PythonAnywhere](https://img.shields.io/badge/pythonanywhere-%23195181.svg?style=for-the-badge&logo=pythonanywhere&logoColor=white)

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
    git clone https://github.com/Rmdsketch/Dutaku-sleman.git
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

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/muhamad-ramadani-937976245/)