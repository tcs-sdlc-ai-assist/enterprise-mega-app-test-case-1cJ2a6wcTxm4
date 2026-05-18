# Enterprise Mega App

A modern, enterprise-grade demo application built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS**. This project provides a robust foundation for building SaaS dashboards, admin panels, or internal tools with user management, subscriptions, payments, and analytics features.

---

## 🚀 Tech Stack

- **React 18** (with hooks, context, and functional components)
- **TypeScript** (strictly typed, scalable codebase)
- **Vite** (blazing-fast dev/build tool)
- **Tailwind CSS** (utility-first styling)
- **@testing-library/react** (user-centric testing)
- **Vitest** (unit and integration tests)
- **Jest-DOM** (extended DOM assertions)

---

## 📁 Folder Structure

```
src/
  components/      # Reusable UI components (forms, lists, modals, etc.)
  contexts/        # React context providers (auth, demo data, payments)
  pages/           # Top-level route/page components
  services/        # Data access, business logic, and demo data store
  types/           # TypeScript type definitions
  App.tsx          # Main app shell and providers
  main.tsx         # Entry point (renders <App />)
  index.css        # Tailwind CSS entry
public/
  index.html       # HTML template
  favicon.*        # App icons
.env.example       # Example environment variables
```

---

## ⚡️ Getting Started

### 1. Clone the repo

```
git clone https://github.com/your-org/enterprise-mega-app.git
cd enterprise-mega-app
```

### 2. Install dependencies

```
npm install
```

### 3. Run the app locally

```
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Run tests

```
npm run test
```

---

## 🛠️ Features

- **Demo Data Store**: All data is stored in browser `localStorage` for easy reset and testing.
- **User Management**: Add, edit, delete users; assign roles; toggle active/inactive.
- **Subscriptions**: Manage user subscriptions, plans, and statuses.
- **Payments**: Simulate payments with various methods and statuses.
- **Analytics**: Track and display user events and system analytics.
- **Role-based Access**: Admin-only and protected routes.
- **Responsive UI**: Built with Tailwind CSS for mobile and desktop.
- **Accessible**: Semantic HTML, keyboard navigation, and ARIA attributes.
- **Testing**: 100% user-centric tests with @testing-library/react and Vitest.

---

## 🧑‍💻 Usage

- **Login**: Use any demo user email (see Users page) to log in.
- **Reset Demo Data**: Admins can reset all demo data from the header.
- **Add/Edit/Delete**: Users, subscriptions, and payments can be managed via the UI.
- **Role Management**: Change user roles from the Users page (except your own).

---

## ⚙️ Configuration

Copy `.env.example` to `.env` and adjust feature flags or API URLs as needed.

```
cp .env.example .env
```

- `VITE_ENABLE_DEMO_DATA=true` (default: enabled)
- `VITE_API_BASE_URL=https://api.example.com`
- `VITE_ANALYTICS_KEY=your-analytics-key-here`

---

## 📝 License

This project is **private** and not licensed for public/commercial use.

---

**© 2024 Enterprise Mega App Team**