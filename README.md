# 🎓 Campus Marketplace

A full-stack campus marketplace web application where college students can buy and sell used products within their campus community.

The project is built using **React.js** for the frontend and **Django REST Framework (DRF)** for the backend. It provides JWT authentication, product management, search and filtering, pagination, purchase requests, favorites, and role-based access control.

---

## 🚀 Features

### 🔐 Authentication & User Management

- User registration
- JWT-based login authentication
- Access and refresh tokens
- User profile
- College information
- Phone number
- Profile image
- Protected APIs using JWT authentication

### 📦 Product Management

Users can:

- Create products
- View products
- View product details
- Update their own products
- Delete their own products
- Upload product images
- Set product condition
- Set product price
- Select product category
- Track product status

Product statuses:

```text
AVAILABLE
RESERVED
SOLD


Campus Marketplace
│
├── Frontend
│   └── React.js
│
└── Backend
    └── Django REST Framework
            │
            ├── Users
            │
            ├── Categories
            │
            ├── Products
            │
            ├── Purchase Requests
            │
            └── Favorites
