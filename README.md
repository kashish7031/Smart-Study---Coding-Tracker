# DevTrack - Smart Study & Coding Tracker

DevTrack is a production-ready web application built with Next.js 14, MongoDB Atlas, and Tailwind CSS. It helps developers track their daily study progress, coding problems solved, and notes.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Database:** MongoDB Atlas (with Mongoose)
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **Deployment:** Vercel

## Features

- **Dashboard:** Visualize total problems solved, study hours, and recent activity.
- **Entry Tracking:** Log daily coding sessions with category, time spent, and notes.
- **CRUD Operations:** Create, Read, Update, and Delete entries seamlessly.
- **Responsive Design:** Fully responsive UI with a clean, modern aesthetic.

## Setup Instructions

### 1. Clone & Install
```bash
git clone <repository-url>
cd devtrack
npm install
```

### 2. Configure Environment
Create a `.env.local` file in the root directory and add your MongoDB connection string:
```bash
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/devtrack?retryWrites=true&w=majority
```

### 3. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment on Vercel

1. Push your code to a GitHub repository.
2. Go to [Vercel](https://vercel.com) and import the project.
3. Add the `MONGODB_URI` environment variable in the Vercel dashboard.
4. Click **Deploy**.

## Folder Structure

```
/app
  /api          # API Routes (Next.js App Router)
  /dashboard    # Dashboard Page
  /add          # Add Entry Page
  /entries      # Entries List Page
  /edit/[id]    # Edit Entry Page
/components     # Reusable UI Components
/lib            # Database Connection
/models         # Mongoose Models
/types          # TypeScript Interfaces
```

## License

MIT