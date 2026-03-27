# Centralized Mess Management System (CMMS) - Frontend

![CMMS Banner](https://img.shields.io/badge/IIT_Kanpur-CMMS-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css)

A modern, comprehensive web application designed to streamline daily mess operations, billing, and student interactions at IIT Kanpur. This repository contains the frontend implementation of the system.

## 🌟 Key Features

### 🎓 Student Portal
- **Extras Store:** 🍞 Browse and book "Extras" from various halls (Hall 1-13, GH1) with real-time stock availability.
- **Smart Billing:** 🧾 Attendance-based billing that accounts for mess closures, holidays, and rebates.
- **QR Verification:** 📱 Instant QR code generation for secure and touchless collection of extra items.
- **Rebate Management:** 📅 Effortlessly apply for and track mess rebates online.
- **Complaint & Feedback:** 📢 Dedicated portal for raising issues and providing feedback on food quality and services.
- **Daily Menu:** 🍽️ Real-time access to the daily mess menu.
- **Booking History:** 📜 Track all previous extra bookings and transactions.

### 🛡️ Admin Portal
- **Dashboard:** 📊 High-level overview of mess operations and student activities.
- **Billing Management:** 💳 Manage student bills, late fines, and financial records.
- **Menu Management:** 📝 Update and schedule daily menus for the mess.
- **Extras Management:** 📦 Manage inventory, pricing, and availability of extra items.
- **Rebate Processing:** ✅ Review and approve/reject student rebate applications.
- **Notification System:** 🔔 Send important alerts and announcements to students.
- **Feedback Management:** 💬 Monitor and respond to student complaints and suggestions.

## 🛠️ Tech Stack

- **Framework:** [React 19](https://react.dev/)
- **Build Tool:** [Vite 8](https://vitejs.dev/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **State Management:** React Context API (for Cart management)
- **Routing:** [React Router 7](https://reactrouter.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **API Interactions:** [Axios](https://axios-http.com/) with custom interceptors for CSRF and JWT Auth.

## 📁 Project Structure

```bash
New-CMMS-Frontend/
├── CMMS-app/           # Main React Application
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Individual page components (Student & Admin)
│   │   ├── Api.jsx     # Axios instance with Auth/CSRF interceptors
│   │   ├── App.jsx     # Main routing and provider setup
│   │   └── main.jsx    # Application entry point
│   ├── public/         # Static assets
│   └── package.json    # Frontend dependencies and scripts
└── pyproject.toml      # Dependency management (Poetry)
```

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd New-CMMS-Frontend/CMMS-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the `CMMS-app/` directory:
   ```env
   VITE_API_URL=http://your-backend-api-url
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173`.

## 🔒 Authentication & API

The frontend includes a robust API layer (`Api.jsx`) that handles:
- **CSRF Protection:** Automatically extracts and attaches CSRF tokens from cookies for state-changing requests.
- **JWT Handling:** Token-based authentication with automatic refresh logic for expired access tokens.
- **Protected Routes:** Specialized components (`ProtectedRoute` and `AdminProtectedRoute`) to restrict access based on user roles.

## 🤝 Contributing

This project is part of the CS253 course project at IIT Kanpur.

---
*Developed with ❤️ for IIT Kanpur Students.*
