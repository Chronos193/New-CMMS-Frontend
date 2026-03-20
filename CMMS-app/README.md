# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


# CMMS - Centralized Mess Management System (IIT Kanpur)

A comprehensive React-based frontend for managing daily mess operations, billing, and student interactions.

## 🚀 Completed Modules (Kavita - 230552)

### 1. Extras Store (`ExtrasPage.jsx`)
- **Hall Selection:** Students can browse "Extras" menus for all halls (Hall 1-13, GH1).
- **Real-time Stock:** Mock logic for item availability and inventory management.
- **Booking System:** Interactive "Book Now" flow with automated token generation.
- **QR Verification:** Secure QR code generation for mess workers to scan at the counter.

### 2. Billing & Analytics (`BillingPage.jsx`)
- **Attendance-Based Billing:** Logic for calculating bills based on:
  - Total Month Days
  - Mess Closure Days (Pest Control, Holidays)
  - Student Rebate Days
- **Financial Breakdown:** Clear separation of "Basic Mess Dues" and "Extras Ledger."
- **Export Feature:** Simulated "Download Receipt" functionality for student records.
- **Due Date Alerts:** Visual indicators for payment deadlines to avoid late fines.

---

## 🛠️ Tech Stack
- **Frontend:** React + Vite
- **Styling:** Tailwind CSS
- **Icons:** Lucide-React
- **Components:** Headless UI / Custom Tailwind Components

## 💻 Developer Setup
1. Clone the repository
2. Install dependencies: `npm install`
3. Run development server: `npm run dev`