# 🌱 BioNova - Organic Farming Platform

![Laravel](https://img.shields.io/badge/Laravel-11.x-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)
![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

An integrated, full-stack web application designed to promote organic farming awareness and facilitate a marketplace for organic products. Built with a robust **Laravel 11 backend** and a dynamic **React + TypeScript frontend**.

---

## 📋 Table of Contents
- [Features](#-features)
- [Technology Stack](#️-technology-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#️-getting-started-local-development)
  - [Backend Setup](#1-backend-setup-laravel)
  - [Frontend Setup](#2-frontend-setup-reactvite)
- [Docker Support](#-running-with-docker-optional)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🚀 Features

- **Role-Based Access Control (RBAC):** Distinct interfaces and privileges for Admins, Proposers, and Customers.
- **Secure Authentication:** Powered by Laravel Sanctum with seamless MongoDB integration.
- **Marketplace & Inventory Management:** Full CRUD capabilities for organic products and agricultural resources.
- **Location-Based Filtering:** Easily discover products and awareness campaigns tailored to specific regions.
- **Content Moderation:** Admins have full control over the platform, including the ability to moderate content, manage users, and delete articles.
- **Secure Checkout Process:** A seamless and secure cart and checkout experience restricted to authenticated customers.
- **Dynamic UI/UX:** Earthy-themed, responsive design built for accessibility and performance.

## 🛠️ Technology Stack

### Frontend
- **Framework:** React 18
- **Language:** TypeScript
- **Build Tool:** Vite
- **Styling:** CSS (Modern, earthy-themed UI/UX)

### Backend
- **Framework:** Laravel 11
- **Database:** MongoDB
- **Authentication:** Laravel Sanctum API Authentication

### DevOps & Tools
- **Containerization:** Docker & Docker Compose
- **Version Control:** Git & GitHub

## 📁 Project Structure

The repository is divided into two main workspaces:
- `/backend`: The Laravel API, models, controllers, and backend services.
- `/frontend`: The Vite-powered React application, components, and pages.

---

## ⚙️ Getting Started (Local Development)

### Prerequisites
- PHP >= 8.2 & Composer
- Node.js >= 18 & npm/yarn
- MongoDB instance running locally or via Atlas

### 1. Backend Setup (Laravel)

Navigate to the backend directory:
```bash
cd backend
```

Install PHP dependencies:
```bash
composer install
```

Set up your environment variables:
```bash
cp .env.example .env
```
*(Make sure to update your MongoDB database credentials in the `.env` file)*

Generate application key:
```bash
php artisan key:generate
```

Run database migrations and seeders (to populate roles, admins, and initial data):
```bash
php artisan migrate --seed
```

Run the development server:
```bash
php artisan serve
```
The backend API will be available at `http://127.0.0.1:8000`.

### 2. Frontend Setup (React/Vite)

Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

Install Node dependencies:
```bash
npm install
```

Start the Vite development server:
```bash
npm run dev
```
The frontend application will be available at `http://localhost:5173`.

---

## 🐳 Running with Docker (Optional)
If you prefer running the application in containers, ensure Docker is installed and use the provided Docker compose configurations:
```bash
docker-compose up -d --build
```
*Check the respective docker files and `docker-compose.yml` for port mappings and environment configs.*

---

## 🤝 Contributing

Contributions are always welcome! If you'd like to improve this project:
1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📜 License
This project is open-source and available under the [MIT License](LICENSE).
