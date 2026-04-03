
# StayEase Frontend

A modern, full-featured frontend for StayEase — a student housing and travel booking platform. Built with React, Vite, and Tailwind CSS.

## Features
- Student housing and hotel search & booking
- Flight search and booking
- User dashboard with real bookings, wallet, and profile
- AI assistant for travel planning
- Responsive design for desktop and mobile
- Modern UI with smooth transitions and animations

## Tech Stack
- **React 19**
- **Vite** (fast dev/build)
- **TypeScript**
- **Tailwind CSS**
- **React Router v7**
- **Lucide Icons**
- **GSAP & Motion** (animations)

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)

### Setup
1. Install dependencies:
   ```sh
   npm install
   ```
2. Copy `.env.example` to `.env.local` and set your environment variables (e.g. API base URL, Gemini API key).
3. Start the development server:
   ```sh
   npm run dev
   ```
   The app will be available at [https://stayease-frontend.vercel.app](https://stayease-frontend.vercel.app).

### Build for Production
```sh
npm run build
```
The output will be in the `dist/` folder.

### Lint/Typecheck
```sh
npm run lint
```

## Project Structure
```
frontend/
  src/
    components/   # Reusable UI components
    pages/        # Route-based pages (Dashboard, Home, etc.)
    services/     # API clients (booking, user, property, etc.)
    index.css     # Tailwind/global styles
    main.tsx      # App entry point
    App.tsx       # App layout and routes
```

## Environment Variables
- `VITE_API_BASE_URL` — Backend API URL
- `GEMINI_API_KEY` — (optional) Gemini AI key for assistant

## Scripts
- `npm run dev` — Start dev server
- `npm run build` — Build for production
- `npm run preview` — Preview production build
- `npm run lint` — Typecheck and lint

## License
MIT
