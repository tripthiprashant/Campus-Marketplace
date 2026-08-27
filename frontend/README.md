# Campus Marketplace — Modern React Frontend

A production-quality, student-centric **React.js + Tailwind CSS** frontend for the Campus Marketplace peer-to-peer student trading platform.

Built to integrate seamlessly with the existing Django REST Framework backend with **zero backend modifications**.

---

## 🚀 Key Features

* **Landing Page (`/`)**:
  - Hero banner with instant keyword search and quick actions ("Browse Products", "Sell Item")
  - Dynamic categories grid with contextual category icons
  - Recently listed campus items carousel/grid
  - Student safety and "How It Works" 3-step guide
  - Quick CTA banner for selling unused student items

* **Product Browsing & Search (`/products`)**:
  - Full-text search with debounce across product titles and descriptions
  - Multi-faceted filtering:
    - Category filtering
    - Condition filtering (*Brand New*, *Like New*, *Good Condition*, *Fair / Usable*)
    - Price range min/max numerical inputs
  - Sorting (Newest First, Oldest First, Price: Low to High, Price: High to Low, Alphabetical)
  - Active filter badges with one-click removal and "Clear All"
  - Responsive desktop sticky sidebar and mobile drawer
  - Pagination controls

* **Product Details (`/products/:id`)**:
  - High-resolution product image preview with fallback placeholder
  - Condition badge, price in Indian Rupee format (`₹`), and status tag
  - Seller information card with student verification badge
  - Item description and timestamp
  - **Purchase Request Modal**: Buyers can send a purchase request directly to the seller
  - **Wishlist / Favorite Toggle**: Instant toggle with optimistic updates
  - **Owner Controls**: Edit listing and Delete listing (with confirmation modal)

* **Add & Edit Listings (`/add-product`, `/edit-product/:id`)**:
  - Form validation with error feedback
  - Dynamic category selector fetched from API
  - Condition chip selector
  - Image upload with drag & drop and instant image preview
  - Edit pre-fills existing listing details and supports availability toggle

* **My Listings & Transactions Dashboard (`/my-listings`)**:
  - **My Listings Tab**: View all posted products, edit details, or delete listings
  - **Buyer Requests Tab**: Manage incoming purchase requests from other students (Accept, Decline, Complete Transaction / Mark Sold)
  - **My Sent Requests Tab**: Track status of purchase requests sent to other sellers, with option to cancel pending requests

* **Saved Wishlist (`/favorites`)**:
  - Gallery of favorited campus listings with quick access to details and removal

* **Student Profile (`/profile`)**:
  - View username, email, college, phone, and profile avatar
  - Update profile details and upload new avatar photo
  - Quick navigation shortcuts

* **Authentication (`/login`, `/register`)**:
  - JWT token authentication (Access token + Refresh token) with automated Axios interceptor refresh on 401
  - Student registration with username, email, college, phone, password, and optional avatar image
  - Password visibility toggle and client-side validation
  - Redirects back to previous page after successful login

---

## 🛠️ Tech Stack

* **Framework**: React 19 + Vite
* **Routing**: React Router v7 (`react-router-dom`)
* **Styling**: Tailwind CSS v3 + PostCSS + Autoprefixer
* **Icons**: Lucide React
* **HTTP Client**: Axios (with JWT interceptors, auto token refresh, and DRF error extraction)
* **State Management**: React Context API (`AuthContext`, `FavoriteContext`, `ToastContext`)

---

## 📁 Folder Structure

```text
frontend/
├── public/
│   └── favicon.svg
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── auth/
│   │   │   └── ProtectedRoute.jsx
│   │   ├── common/
│   │   │   ├── Badge.jsx
│   │   │   ├── ConfirmationModal.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   ├── ErrorMessage.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Pagination.jsx
│   │   │   ├── SkeletonCard.jsx
│   │   │   └── Toast.jsx
│   │   ├── products/
│   │   │   ├── CategoryCard.jsx
│   │   │   ├── FilterDrawer.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── ProductForm.jsx
│   │   │   ├── ProductGrid.jsx
│   │   │   └── SearchBar.jsx
│   │   └── requests/
│   │       ├── PurchaseRequestModal.jsx
│   │       └── RequestCard.jsx
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   ├── FavoriteContext.jsx
│   │   └── ToastContext.jsx
│   ├── pages/
│   │   ├── AddProduct.jsx
│   │   ├── EditProduct.jsx
│   │   ├── Favorites.jsx
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── MyListings.jsx
│   │   ├── NotFound.jsx
│   │   ├── ProductDetails.jsx
│   │   ├── Products.jsx
│   │   ├── Profile.jsx
│   │   └── Register.jsx
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── categoryService.js
│   │   ├── favoriteService.js
│   │   ├── productService.js
│   │   └── requestService.js
│   ├── utils/
│   │   ├── formatters.js
│   │   └── imageHelper.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .env
├── .env.example
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

## ⚙️ Installation & Running

### Prerequisites

* Node.js (v18 or higher)
* Python 3.10+ (for Django backend)

### 1. Start the Django Backend

In a terminal:

```bash
cd backend
# On Windows:
.\venv\Scripts\python.exe manage.py runserver 127.0.0.1:8000
```

The backend will be running at `http://127.0.0.1:8000`.

### 2. Start the React Frontend

In a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will start at `http://localhost:5173`.

---

## 🔒 Environment Variables

Create a `.env` file inside the `frontend/` directory (or use `.env.example`):

```env
# Backend API Base URL
VITE_API_BASE_URL=http://127.0.0.1:8000
```

---

## 📡 API Endpoints Utilized

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/v1/users/register/` | POST | Register new student user |
| `/api/v1/users/login/` | POST | Obtain JWT access + refresh tokens |
| `/api/v1/users/token/refresh/` | POST | Refresh expired access token |
| `/api/v1/users/profile/` | GET, PATCH | View & update authenticated profile |
| `/api/v1/categories/` | GET | List available categories |
| `/api/v1/categories/<id>/` | GET | Retrieve single category |
| `/api/v1/products/` | GET, POST | List with filters / Create listing |
| `/api/v1/products/<id>/` | GET, PATCH, DELETE | Product detail, edit, delete |
| `/api/v1/favorites/` | GET, POST | List wishlist / Add item |
| `/api/v1/favorites/<id>/` | DELETE | Remove item from wishlist |
| `/api/v1/requests/` | GET, POST | List requests / Create purchase request |
| `/api/v1/requests/<id>/accept/` | POST | Seller accepts request (reserves item) |
| `/api/v1/requests/<id>/reject/` | POST | Seller rejects request |
| `/api/v1/requests/<id>/cancel/` | POST | Buyer cancels request |
| `/api/v1/requests/<id>/complete/`| POST | Seller completes deal (marks SOLD) |

---

## 🛡️ Security Best Practices Followed

* Zero exposed secrets or credentials.
* Passwords never logged or stored in plain state.
* Clean separation of concern with protected route wrappers.
* Secure token handling with automatic 401 refresh mechanism and auto-logout on refresh token expiration.
* DRF backend remains completely untouched and pristine.
