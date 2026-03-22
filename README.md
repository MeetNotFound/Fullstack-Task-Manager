# 🚀 Fullstack Task Management Dashboard

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2015-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![JWT](https://img.shields.io/badge/Security-JWT-black?style=for-the-badge&logo=json-web-tokens)](https://jwt.io/)
[![Tailwind CSS](https://img.shields.io/badge/UI-Tailwind%20CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

A comprehensive project management tool featuring a secure RESTful API and a modern, responsive React interface. This project was developed as a technical assessment for the Software Developer Intern role.

---

## 📸 Application Preview

| Login & Authentication | Dashboard & Task Analytics |
| :--- | :--- |
| ![Login](./Login.png) | ![Dashboard](./Dashboard.png) |

---

## 🛠️ Technical Decisions

During development, the following architectural choices were made to ensure scalability, security, and developer efficiency:

* **FastAPI (Python):** Chosen for its high performance, native asynchronous support, and automatic generation of OpenAPI/Swagger documentation, which significantly streamlined backend testing.
* **Next.js 15 (App Router):** Selected to leverage modern React patterns like Server Components and efficient client-side state management for a smooth user experience.
* **Secure Authentication (JWT + Bcrypt):** While optional, I implemented **JSON Web Tokens** and **Bcrypt** password hashing to ensure data isolation. Users can only access and manage their own specific tasks.
* **SQLite with SQLAlchemy ORM:** Used to provide a lightweight, zero-config persistence layer. Using an ORM allows for easy migration to PostgreSQL in a production environment.
* **Tailwind CSS:** Utilized for a clean, professional "Dashboard" aesthetic without the overhead of heavy external UI libraries.

---

## 🚦 Local Setup Instructions

Follow these steps to get the project running on your local machine.

### 1. Prerequisites
* Python 3.10+
* Node.js 18+

### 2. Backend Setup
```bash
cd backend
# Create and activate virtual environment
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install fastapi uvicorn sqlalchemy pydantic pyjwt bcrypt python-multipart

# Run the server (available at http://127.0.0.1:8000)
uvicorn main:app --reload
```

### 3. Frontend Setup
```bash
cd frontend
# Install dependencies
npm install

# Run the development server (available at http://localhost:3000)
npm run dev
```

---

## 🔮 Future Improvements
If given more time to move this project toward a production-ready state, I would implement:

Database Migration: Move from SQLite to PostgreSQL to handle concurrent users and complex relational queries more robustly.

Containerization: Implement Docker and docker-compose to ensure the application runs identically across all development and production environments.

Enhanced Filtering & Search: Add a search bar to filter tasks by title/description and implement server-side pagination for large task lists.

Unit & Integration Testing: Add a comprehensive test suite using pytest for the backend and Jest/React Testing Library for the frontend to prevent regressions.

---

## 📬 Contact
Meet Pawar - meet.pawar24@gmail.com

GitHub Profile - https://github.com/MeetNotFound
