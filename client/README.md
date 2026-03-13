# Weathery Client (React + Vite)

Frontend for the Weather Analytics assignment.

## Features Implemented

- Responsive dashboard layout (desktop + mobile)
- Sidebar with 4 navigation items: Dashboard, Rankings, Analytics, Settings
- Login screen with Auth0 authentication flow
- Protected routes (only authenticated users can access app pages)
- Theme toggle (Dark/Light) in sidebar (replaces notification button)
- Weather visualizations and charts (Recharts)
- Cache status display (HIT / MISS) from backend response
- City ranking by backend-computed Comfort Index score

## Tech Stack

- React 19 + Vite
- React Router
- Auth0 React SDK
- Recharts
- Axios
- React Icons

## Setup

1. Install dependencies

	npm install

2. Configure Auth0 values in `.env`

	VITE_AUTH0_DOMAIN=your-tenant.auth0.com
	VITE_AUTH0_CLIENT_ID=your_client_id_here

3. Start backend (`server` folder) on port 5000

4. Start frontend

	npm run dev

5. Build and lint checks

	npm run lint
	npm run build

## Auth0 Requirements (Assignment Mapping)

The frontend is wired for Auth0. The following must be configured in Auth0 Dashboard:

- Disable public signups in your database connection
- Keep only whitelisted users (e.g. `careers@fidenz.com`)
- Enable MFA (Email OTP or Authenticator App)
- Add Allowed URLs:
  - Callback: `http://localhost:5173`
  - Logout: `http://localhost:5173/login`
  - Web Origins: `http://localhost:5173`

## API Endpoints Used

- GET `/api/weather/comfort-ranking`
- GET `/api/weather/city/:cityId`

## Comfort Index Formula (Computed in Backend)

The UI consumes the backend-computed score (0–100):

Score = 0.4 × TempScore + 0.3 × HumidityScore + 0.3 × WindScore

- TempScore = max(0, 100 − |T − 298K|)
- HumidityScore = 100 − humidity
- WindScore = 100 − (wind × 10)

Reasoning for weights:

- Temperature has highest direct comfort impact → 40%
- Humidity strongly affects thermal perception → 30%
- Wind affects comfort but is secondary here → 30%

## Trade-offs

- Backend currently provides 3 cities from `cities.json`.
- UI is prepared for additional cities; minimum 10 cities requires backend data expansion.
- Some weather visuals (UV trend, radar metrics) are approximated for dashboard storytelling where API does not provide direct values.

## Known Limitations

- Auth0 MFA and signup restrictions are configured in Auth0 Dashboard, not enforced solely by frontend code.
- Bundle size is relatively large due to charting/icon libraries; can be optimized with route-level code splitting.
