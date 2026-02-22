# 📈 Consistency Tracker (Full-Stack Habit Application)

A premium, fast, and secure full-stack habit tracking application built with **Next.js**, **React**, **TypeScript**, **Tailwind CSS**, and **Prisma**. This application allows users to create habits, track daily completions (with optional notes), visualize their progress, and build consistency.

---

## 🚀 Features

### Core Capabilities
* **Secure Authentication:** Full registration and login flow using NextAuth.js and Bcrypt for secure password hashing.
* **Habit Management:** Create, Read, Update, and Delete (CRUD) habits with custom categories, descriptions, and reminder times.
* **Daily Tracking validation:** Prevent multiple completions of the same habit on the same day. 
* **Analytics Dashboard:** Visual insights showing Current Streak, Weekly Progress (via animated bar charts), and overall completion rates.

### 🌟 Bonus Features & Technical Enhancements
* **Premium UI/UX:** Built with Framer Motion and advanced Tailwind CSS, featuring physics-based micro-interactions, dynamic mesh gradient backgrounds, and fully responsive design.
* **Strict Input Validation:** All API endpoints are structurally protected and type-checked using **Zod** schema validation, returning standardized error responses.
* **Optimistic UI Data Fetching:** Utilizes **SWR** for intelligent client-side caching, instantly updating the UI when tracking a habit without waiting for the network request (zero latency feel).
* **API Rate Limiting:** Custom Next.js Middleware protects API routes from spam and abuse (`/api/*`).
* **Habit Notes:** Track more than just a checkbox—add contextual notes to a specific log when completing a habit.

---

## 🏗️ Architecture Overview

The app follows a modern Full-Stack Next.js (App Router) architecture:

1. **Frontend (Client):** Modular React components built with Tailwind CSS. State and data fetching are decoupled into a custom hook (`useDashboardData`) utilizing SWR.
2. **Backend (Server):** Next.js API Route Handlers (`/api/habits`, `/api/auth`, etc.) handle secure transactions. Next.js Middleware sits in front of the API to handle Rate Limiting and JWT Authentication checks.
3. **Database (ORM):** Prisma ORM handles structured, type-safe queries.

---

## 🗄️ Database Schema & Relationships

The database is built on a relational model (PostgreSQL in production, SQLite for local dev).

**1. `User` Model**
* Tracks `id`, `name`, `email` (unique), and `passwordHash`.
* **Relationship:** A User has a one-to-many relationship with `Habit`.

**2. `Habit` Model**
* Tracks `id`, `title`, `description`, `category`, and `reminderTime`.
* **Relationship:** A Habit belongs to one `User`, and has a one-to-many relationship with `HabitLog`.

**3. `HabitLog` Model**
* Tracks a specific completion event. Contains `id`, `date` (YYYY-MM-DD), and `note`.
* **Constraint:** A unique compound constraint `@@unique([habitId, date])` is enforced at the database level to mathematically guarantee a habit is never tracked twice on the same day.

---

## 💻 Local Setup & Run Instructions

### Prerequisites
* Node.js (v18+)
* npm or yarn

### Steps
1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd consistency-tracker
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory:
   ```env
   # Default to local SQLite for rapid development
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_SECRET="your-super-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Initialize the Database:**
   Run Prisma migrations to create the SQLite tables:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   *Visit `http://localhost:3000` to view the application.*

---

## ☁️ Deployment Steps

This application is designed to be easily deployed to **Vercel** with a serverless Postgres database.

1. **Database Setup:**
   * Create a Next.js Postgres, Supabase, or Neon database.
   * Update the `prisma/schema.prisma` file to use PostgreSQL:
     ```prisma
     datasource db {
       provider = "postgresql"
       url      = env("DATABASE_URL")
     }
     ```
2. **Push to GitHub:** Ensure your latest code is on the main branch.
3. **Deploy to Vercel:**
   * Import the project into Vercel.
   * Add the Environment Variables (`DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`).
   * Vercel will automatically run `npm install` and `npm run build`. Note: ensure `npx prisma generate` is in your build script in `package.json` (`"build": "prisma generate && next build"`).

---

## 🤔 Assumptions Made
* **Timezones:** Habit tracking is currently based on the user's local browser timezone (ISO strings split by "T"). In a massive global application, this might require deeper UTC offset synchronization depending on when the user defines "midnight".
* **Rate Limiting:** The in-memory rate map is sufficient for an assignment. In a heavy production environment (like serverless Vercel), this would be replaced by Redis (e.g., Upstash) because serverless functions don't share memory perfectly.
