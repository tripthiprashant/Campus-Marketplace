# 🎓 Campus Marketplace

A full-stack web application that enables college students to **buy and sell products within their campus community**.

Built with **React.js** on the frontend and **Django REST Framework** on the backend, the platform provides secure authentication, product listings, search and filtering, favorites, purchase requests, and user profile management.

> 🚧 **Project Status:** Full-stack development completed. Deployment is in progress.

---


## ✨ Features

### 🔐 Authentication & User Management

* User registration and login
* JWT-based authentication
* Access and refresh tokens
* Protected API endpoints
* User profile management
* College information
* Phone number
* Profile image support
* Authentication-aware frontend routes

### 📦 Product Management

Users can:

* Create product listings
* View all products
* View product details
* Edit their own listings
* Delete their own listings
* Upload product images
* Set product price
* Select product category
* Specify product condition
* Track product status

### 📊 Product Status

Products can have different statuses:

* `AVAILABLE`
* `RESERVED`
* `SOLD`

### 🔎 Search & Filtering

* Search products
* Filter products by category
* Filter products based on available criteria
* Pagination for product listings

### ❤️ Favorites

* Add products to favorites
* Remove products from favorites
* View favorite products

### 🤝 Purchase Requests

* Send purchase requests for products
* View purchase requests
* Manage purchase-request status
* Track interactions between buyers and sellers

### 🛡️ Authorization

* Protected frontend routes
* JWT-protected backend APIs
* Users can modify their own listings
* Permission-based access to marketplace operations

---

## 🏗️ System Architecture

```text
                    Campus Marketplace
                           │
              ┌────────────┴────────────┐
              │                         │
          Frontend                  Backend
              │                         │
          React.js              Django REST Framework
              │                         │
          Axios/API                    REST API
                                        │
                     ┌──────────────────┼──────────────────┐
                     │                  │                  │
                   Users             Products          Categories
                     │                  │
                     │            Purchase Requests
                     │                  │
                     └────────── Favorites ───────────────┘
```

---

## 🛠️ Tech Stack

### Frontend

| Technology   | Purpose                |
| ------------ | ---------------------- |
| React.js     | User interface         |
| JavaScript   | Application logic      |
| Axios        | API communication      |
| React Router | Client-side routing    |
| Tailwind CSS | Styling                |
| Vite         | Development/build tool |

### Backend

| Technology            | Purpose              |
| --------------------- | -------------------- |
| Python                | Backend programming  |
| Django                | Web framework        |
| Django REST Framework | REST APIs            |
| JWT                   | Authentication       |
| Django ORM            | Database interaction |

### Development Tools

* Git
* GitHub
* VS Code
* Postman

---

## 📁 Project Structure

```text
Campus-Marketplace/
│
├── backend/
│   │
│   ├── config/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── wsgi.py
│   │   └── asgi.py
│   │
│   ├── users/
│   ├── products/
│   ├── categories/
│   ├── favorites/
│   ├── purchase_requests/
│   │
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/
│   │
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

# 🚀 Getting Started

## Prerequisites

Make sure you have installed:

* Python 3.10+
* Node.js 18+
* npm
* Git

---

# ⚙️ Backend Setup

### 1. Clone the repository

```bash
git clone https://github.com/tripthiprashant/Campus-Marketplace.git
cd Campus-Marketplace
```

### 2. Navigate to the backend

```bash
cd backend
```

### 3. Create a virtual environment

Windows:

```bash
python -m venv venv
```

Activate it:

```bash
venv\Scripts\activate
```

Linux/macOS:

```bash
python3 -m venv venv
source venv/bin/activate
```

### 4. Install dependencies

```bash
pip install -r requirements.txt
```

### 5. Configure environment variables

Create:

```text
backend/.env
```

Example:

```env
SECRET_KEY=your-secret-key
DEBUG=True
```

> Never commit your real `.env` file to GitHub.

You can use `.env.example` to document the required environment variables.

### 6. Apply migrations

```bash
python manage.py migrate
```

### 7. Create a superuser

```bash
python manage.py createsuperuser
```

### 8. Start the backend server

```bash
python manage.py runserver
```

Backend:

```text
http://127.0.0.1:8000/
```

---

# 💻 Frontend Setup

Open another terminal.

### 1. Navigate to frontend

```bash
cd frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create:

```text
frontend/.env
```

Example:

```env
VITE_API_URL=http://127.0.0.1:8000/api/v1
```

### 4. Start the development server

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173/
```

---

# 🔌 API Overview

The backend exposes RESTful APIs for the major marketplace modules.

### Authentication

```text
POST /api/v1/users/register/
POST /api/v1/users/login/
POST /api/v1/users/login/refresh/
```

### Products

```text
GET    /api/v1/products/
POST   /api/v1/products/
GET    /api/v1/products/<id>/
PUT    /api/v1/products/<id>/
DELETE /api/v1/products/<id>/
```

### Categories

```text
GET /api/v1/categories/
```

### Favorites

```text
GET    /api/v1/favorites/
POST   /api/v1/favorites/
DELETE /api/v1/favorites/<id>/
```

### Purchase Requests

```text
GET  /api/v1/purchase-requests/
POST /api/v1/purchase-requests/
```

> API endpoints may change as development continues. Refer to the backend URL configuration for the latest routes.

---

# 🔐 Security

The project follows basic security practices including:

* JWT authentication
* Protected API endpoints
* Environment variables for sensitive configuration
* `.gitignore` for secrets and generated files
* User-level authorization
* Protected frontend routes

**Never commit:**

```text
.env
db.sqlite3
venv/
node_modules/
__pycache__/
*.pyc
```

---

# 🎯 Project Goals

The main goals of Campus Marketplace are:

1. Provide a dedicated marketplace for college students.
2. Make buying and selling used products easier within a campus.
3. Provide secure user authentication.
4. Allow students to manage their own listings.
5. Provide search and filtering for easier product discovery.
6. Support buyer-seller interaction through purchase requests.
7. Provide a modern and responsive user interface.

---

# 🔮 Future Improvements

Planned improvements include:

* [ ] Deploy frontend
* [ ] Deploy backend
* [ ] Production database
* [ ] Real-time chat between buyers and sellers
* [ ] Email notifications
* [ ] Advanced product recommendations
* [ ] Seller ratings and reviews
* [ ] Location-based campus filtering
* [ ] Admin dashboard
* [ ] Automated testing
* [ ] CI/CD pipeline

---

# 📌 Project Status

| Component          | Status         |
| ------------------ | -------------- |
| React Frontend     | ✅ Completed    |
| Django Backend     | ✅ Completed    |
| REST APIs          | ✅ Completed    |
| JWT Authentication | ✅ Completed    |
| Product Management | ✅ Completed    |
| Search & Filtering | ✅ Completed    |
| Favorites          | ✅ Completed    |
| Purchase Requests  | ✅ Completed    |
| Deployment         | 🚧 In Progress |

---

# 👨‍💻 Developer

**Prashant Pratap Tripathi**

B.Tech Computer Science & Engineering

### Connect

* GitHub: https://github.com/tripthiprashant
* Project: https://github.com/tripthiprashant/Campus-Marketplace

---

## ⭐ If you find this project useful

Consider giving the repository a ⭐ on GitHub!

---

## 📄 License

This project is developed for educational and portfolio purposes.
