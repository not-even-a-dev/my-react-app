# Student To-Do + Habit App

A web-based to-do and habit tracking application designed for students, featuring a fun, gamified interface that makes productivity enjoyable.

## Overview

This is a full-stack frontend application built with React, TypeScript, and modern web technologies. The app combines task management and habit tracking into a single, visually engaging interface with gamification elements to motivate daily engagement.

## Tech Stack

### Core
- **React 18.x** - UI framework
- **TypeScript 5.x** - Type safety
- **Vite 5.x** - Build tool and dev server

### UI & Styling
- **Tailwind CSS 3.x** - Utility-first styling
- **Lucide React** - Icon library
- **Framer Motion 11.x** - Animations and micro-interactions

### State & Data
- **Zustand 4.x** - State management
- **Dexie 4.x** - IndexedDB wrapper for local storage
- **React Hook Form 7.x** - Form handling
- **Zod 3.x** - Schema validation

### Features
- **React Router 6.x** - Client-side routing
- **@dnd-kit/core 6.x** - Drag and drop
- **date-fns 3.x** - Date utilities
- **rrule 2.x** - Recurring tasks/habits

### Development
- **Vitest 1.x** - Unit testing
- **Testing Library** - Component testing
- **ESLint** - Linting
- **Prettier** - Code formatting

## Getting Started

### Prerequisites

- Node.js 18+ and npm (or yarn/pnpm)
- Firebase project with Authentication enabled

### Firebase Setup

**IMPORTANT**: For Google authentication to work, you must configure Firebase properly:

1. **Create a Firebase project** at [Firebase Console](https://console.firebase.google.com/)

2. **Enable Authentication**:
   - Go to Firebase Console > Authentication > Get Started
   - Enable "Google" as a sign-in provider

3. **Configure Authorized Domains**:
   - Go to Firebase Console > Authentication > Settings > Authorized domains
   - Add your domains:
     - `localhost` (already included for development)
     - Your production domain (e.g., `yourapp.vercel.app`)
     - Any other domains where you'll deploy the app

4. **Get your Firebase config**:
   - Go to Project Settings > General
   - Scroll to "Your apps" section
   - Copy your Firebase configuration

5. **Create environment file**:
   - Create a `.env` file in the root directory:
   ```env
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   ```

**Common Issues**:
- "The requested action is invalid" error: Ensure your domain is added to Authorized domains in Firebase Console
- Google sign-in not working: Verify the Google provider is enabled in Authentication > Sign-in method

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up your `.env` file with Firebase credentials (see Firebase Setup above)

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

5. Preview production build:
```bash
npm run preview
```

## Project Structure

```
src/
  app/                      # App shell (providers, router)
  components/               # Shared UI components
  features/
    tasks/                  # Task management screens
    habits/                 # Habit tracking screens
    dashboard/              # Dashboard and stats
  stores/                   # Zustand stores
  db/                       # Dexie schema and adapters
  hooks/                    # Custom React hooks
  utils/                    # Utilities and helpers
  styles/                   # Global styles and Tailwind
  assets/                   # Static assets
```

## Features

- ✅ Task Management with due dates, recurring tasks, subtasks
- 🎯 Habit Tracking with streak visualization
- 🎮 Gamified feedback and rewards
- 📊 Progress Dashboard
- 🔔 In-browser notifications
- 📱 Mobile-responsive design

## Development

- Run linting: `npm run lint`
- Run tests: `npm test`

## Deployment

This project is configured for deployment on **Vercel** with zero-config setup.

## License

MIT

