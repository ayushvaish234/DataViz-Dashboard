# DataViz Dashboard 

[![Frontend](https://img.shields.io/badge/Frontend-React.js-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Styling](https://img.shields.io/badge/Styling-Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Backend](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)

A web-based **data visualization platform** that allows users to upload datasets, explore them in interactive tables, and generate dynamic charts with filters. Admins can manage all datasets with ease.

---

## Features ✨

### User Features (Member/Admin)
- **Signup/Login** with secure authentication.
- **Upload datasets** in **CSV or JSON** format.
- **Interactive tables**: Paginated, sortable, and filterable for easy data exploration.
- **Dynamic charts**: Generate **Bar, Line, and Pie** charts with selectable X & Y axes.
- **Filters**: Apply column-based filters that instantly update both the table and charts.
- **Persistent data**: Uploaded datasets remain accessible across sessions.
- **Light/Dark mode toggle**.

### Admin Features
- View **all datasets** uploaded by any user.
- **Delete datasets** to maintain data hygiene.
- **Role-based access control**: Differentiate between Admin and Member roles.

---

## Tech Stack 🛠️

- **Frontend**: **React.js** with **Tailwind CSS** (for rapid styling)
- **Backend**: Python **FastAPI** (for high-performance API development)
- **Database**: PostgreSQL / MySQL / SQLite (or any supported SQL/NoSQL DB)
- **Authentication**: **JWT-based** with granular role management for Admin/Member

---
## Setup Instructions 🚀

### 1. Backend (Python/FastAPI)

1.  **Create a virtual environment**:
    ```bash
    python -m venv venv
    source venv/bin/activate    # Linux/Mac
    venv\Scripts\activate       # Windows
    ```
2.  **Install dependencies**:
    ```bash
    pip install -r requirements.txt
    ```
3.  **Run the FastAPI server**:
    ```bash
    uvicorn main:app --reload
    ```
    The API will be running on `http://localhost:8000` (default for uvicorn).

### 2. Frontend (React/Tailwind)

1.  **Navigate to frontend folder**:
    ```bash
    cd frontend
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Run React dev server**:
    ```bash
    npm start
    ```
    The dashboard will be accessible at **`http://localhost:3000`**.

---

## How to Use 📝

1.  **Register/Login** as a Member or Admin. (You may need an initial Admin creation script. *Default Admin email: `admin@example.com`*)
2.  **Upload a dataset** using the dedicated UI (CSV/JSON format).
3.  **View and explore** the data in the interactive table.
4.  Navigate to the **Chart** section and select X and Y axes to generate visualizations.
5.  **Apply filters** (e.g., filter by a specific category column) to refine both the table and the chart view.
6.  **Admin users** will see a separate dashboard panel to view and delete *any* uploaded dataset.

---

## Demo 🖼️

*(Placeholder for demonstration assets - Replace these lines with your actual media)*

| Feature | Screenshot / GIF |
| :--- | :--- |
| **Uploading a Dataset** |  |
| **Interactive Table** |  |
| **Chart Visualization** |  |
| **Admin Management** |  |

---

