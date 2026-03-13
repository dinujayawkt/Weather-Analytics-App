# Climatrix - Weather Analytics Application

Climatrix is a full-stack weather analytics platform with a React frontend and Node.js backend.  
It provides real-time weather insights, city comfort rankings, and a modern authenticated dashboard experience.

## Live Demo

- Vercel Deployment: https://climatrix-analytics.vercel.app

## Project Overview

- **Frontend (`client/`)**: React + Vite dashboard UI, Auth0 login, analytics widgets, rankings, and settings.
- **Backend (`server/`)**: Express API, OpenWeatherMap integration, comfort score calculation, and in-memory caching.
- **Branding**: `RiCloudLine` is used as the Climatrix logo (login + app shell) and is clickable to navigate home.

## Monorepo Structure

```text
client/
  src/
    components/
    pages/
    hooks/
    services/
server/
  controllers/
  routes/
  services/
  cache/
  data/
```

## Features

### Frontend
- Auth0-based login flow and protected routes
- Responsive layout with sidebar + topbar
- Dashboard with weather cards and highlights
- City comfort ranking view
- Analytics and settings pages
- Theme toggle (dark/light)

### Backend
- `GET /api/weather/comfort-ranking`
- `GET /api/weather/city/:cityId`
- OpenWeatherMap current weather fetch by city ID
- Comfort score calculation and sorted ranking
- Cache responses with 5-minute TTL (`node-cache`)

## Tech Stack

- **Client**: React 19, Vite, React Router, Axios, Recharts, React Icons, Auth0 React SDK, TailwindCSS
- **Server**: Node.js, Express, Axios, CORS, dotenv, node-cache

## Environment Variables

### Client (`client/.env`)

```env
VITE_AUTH0_DOMAIN=your-auth0-domain
VITE_AUTH0_CLIENT_ID=your-auth0-client-id
```

### Server (`server/.env`)

```env
OPENWEATHER_API_KEY=your-openweather-api-key
PORT=5000
```

## Local Development

### 1) Install dependencies

```bash
cd client
npm install

cd ../server
npm install
```

### 2) Start backend

```bash
cd server
npm run dev
```

### 3) Start frontend

```bash
cd client
npm run dev
```

Frontend default: `http://localhost:5173`  
Backend default: `http://localhost:5000`

## Available Scripts

### Client
- `npm run dev` - start Vite dev server
- `npm run build` - production build
- `npm run preview` - preview built app
- `npm run lint` - run ESLint

### Server
- `npm run dev` - start server with nodemon
- `npm run start` - start server with node

## Comfort Index Logic

The backend computes the comfort index from temperature, humidity, and wind speed:

```txt
Score = (0.4 * TempScore) + (0.3 * HumidityScore) + (0.3 * WindScore)
TempScore = max(0, 100 - |temp - 298|)
HumidityScore = 100 - humidity
WindScore = 100 - (wind * 10)
```

## Deployment Notes

- Client is deployed on Vercel.
- Server is deployed on Vercel.
- Ensure API proxy/routing is configured so `/api/*` reaches the backend service.
- Add production Auth0 callback/logout URLs in Auth0 settings.

## Future Improvements

- Add stronger backend request validation and centralized error handling
- Add API tests and frontend unit/integration tests
- Expand tracked city dataset beyond the current static city list
- Make backend auth middleware enforcement consistent across routes
