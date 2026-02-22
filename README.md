# Consistency Tracker (Habit Tracking App)

A modern, full-stack web application designed to help users track their daily habits and build consistent routines over time.

## 🚀 Live Demo
*(Insert Live Deployment URL here)*

## ✨ Features
- **User Authentication**: Secure Registration & Login using NextAuth and bcrypt.
- **Habit CRUD**: Create, edit, and delete your habits easily.
- **Daily Tracking**: One-click checkmark to log your habit for the current day.
- **Insights & Progress**:
  - Current continuous streak calculation.
  - Overall completion percentage.
  - 7-day visual weekly progress chart.
- **Mobile-Responsive**: Clean, intuitive UI optimized for both desktop and mobile screens.

## 🛠 Tech Stack
- **Frontend**: Next.js 15 (App Router), React, Tailwind CSS, Lucide Icons
- **Backend**: Next.js Route Handlers (API framework), NextAuth.js
- **Database**: Prisma ORM, SQLite (local) / PostgreSQL (production capability via driver adapters)

## 📐 Architecture Overview
The application follows a standard full-stack Next.js architecture:
1. **Client Components**: Located in `src/app` and `src/components`, handling interactive state, displaying data, and calling internal APIs. Fully styled with Tailwind CSS.
2. **Server API Routes**: Located in `src/app/api`, implementing secure server-side logic in RESTful endpoints protecting unauthorized access.
3. **Database Layer**: Managed by Prisma ORM (`src/lib/prisma.ts`). It handles transactions safely and validates schemas.

### Database Schema
We use three core models:
1. `User` - Authentication details (`email`, `passwordHash`, `name`).
2. `Habit` - Habit definition (`title`, `description`, relationship to `User`).
3. `HabitLog` - A log of completion. Contains `habitId` and `date`. A composite unique constraint on `[habitId, date]` prevents duplicate logs per day for the same habit.

*(See `prisma/schema.prisma` for the exact entity-relationship graph)*

## 📦 Setup & Run Instructions

**Prerequisites:** 
- Node.js LTS (v18+)
- npm or yarn

**1. Clone the repository**
```bash
git clone <repository_url>
cd consistency-tracker
```

**2. Install dependencies**
```bash
npm install
```

**3. Set up environment variables**
Create a `.env` file in the root directory and add the following:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="a-very-secure-random-string"
```

**4. Run database migrations**
Generate the Prisma Client and push the schema to SQLite:
```bash
npx prisma db push
npx prisma generate
```

**5. Start the development server**
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🚢 Deployment Steps (Vercel & PostgreSQL)
To deploy this application to production, you should transition from SQLite to a managed PostgreSQL database (e.g., Neon, Supabase, Vercel Postgres).

1. Push your code to a GitHub repository.
2. Set up a PostgreSQL database and obtain its connection URL.
3. Update your `prisma/schema.prisma`:
   - Keep `provider = "sqlite"` if using a SQLite-compatible remote edge database (like Turso).
   - Change `provider = "postgresql"` if using standard PostgreSQL database and update adapter requirements accordingly.
4. Import your project into Vercel.
5. In the Vercel dashboard, configure the following Environment Variables:
   - `DATABASE_URL`: Your production database URL.
   - `NEXTAUTH_URL`: Your chosen domain URL (e.g., `https://my-habit-tracker.vercel.app`).
   - `NEXTAUTH_SECRET`: Generate a secure random string (e.g., using `openssl rand -base64 32`).
6. Deploy! Vercel will install dependencies, run the Next.js build, and serve your full-stack app globally.

## 🤝 Assumptions Made
- A "Habit" is tracked once per day maximum.
- Habit metrics are calculated locally. Timezones rely on the user's localized browser date (`new Date().toISOString().split("T")[0]`), which simplifies multi-timezone logic but locks logs to the local device's date perspective.
- Using SQLite locally for frictionless reviewer setup.
