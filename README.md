# AET10 Software

Production-ready React application for shooter training and scoring system.

## Features

- **Live Shooting Tracking**: Real-time shot visualization with target display, direction arrows, and score calculation
- **Event Management**: Multiple event types (10m pistol/rifle, 40/60 shots, free series)
- **Performance Analytics**: Graphs and gauges for score tracking and improvement
- **Buddy Training**: Multi-user training sessions with room codes
- **Pellet Testing**: Compare different pellet performance
- **Velocity Measurement**: Measure shot velocity
- **Device Management**: Connect and configure target devices
- **Event History**: Google Photos-style session history

## Tech Stack

- React 18
- Vite
- React Router
- Zustand (State Management)
- Tailwind CSS
- Recharts (Charts & Graphs)
- Axios

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build

```bash
npm run build
```

## Project Structure

```
src/
├── components/       # Reusable UI components
├── layouts/          # Page layouts (Guest, App)
├── pages/            # Application pages
├── store/            # Zustand state management
├── utils/            # Utility functions
├── App.jsx           # Main app with routing
├── main.jsx          # Entry point
└── index.css         # Global styles
```

## Pages

### Priority 1 (Critical)
- Login - Authentication with OTP and guest login
- Dashboard - Tile-based navigation
- Start Event - Event type selection
- Live - Real-time shooting with target visualization
- Events History - Past session history

### Priority 2
- Train Buddy - Multi-user training
- Performance - Analytics dashboard
- Velocity Meter - Shot velocity measurement
- Pellet Tester - Pellet comparison
- Target Setup - Device configuration

### Priority 3
- Competition - Competition mode
- Profile - User profile management

## Key Features

### Live Shooting Page
- Concentric ring target with scoring zones (8, 9, 10, 10x)
- Color-coded bullet markers (cyan for regular, yellow for last shot)
- Direction arrows (8 directions: ↑, ↗, →, ↘, ↓, ↙, ←, ↖)
- Group radius and group center calculation
- Real-time shot tracking with decimal and non-decimal scores
- Timer and session management

### State Management
- Authentication (login, guest, logout)
- Event selection and configuration
- Live shooting session data
- Device connection status
- Pellet testing results
- Buddy training sessions

## Demo Mode

The application includes demo functionality:
- Simulate shots on Live page
- Generate dummy data for testing
- Mock device connections

## License

Proprietary - AET10 Shooting Training System
