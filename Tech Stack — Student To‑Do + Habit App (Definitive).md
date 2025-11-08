# **Tech Stack — Student To‑Do \+ Habit App (Definitive)**

Goal: **Simple, web‑only, beginner‑friendly** stack that still covers tasks, habits, gamification, drag‑and‑drop, recurring items, and in‑browser notifications.

---

## **Platform & Language**

* **Frontend Only (Web SPA)**

* **Language:** TypeScript **5.x**

* **Framework:** React **18.x**

* **Build Tool:** Vite **5.x**

## **UI / Styling**

* **Tailwind CSS 3.x** for utility‑first styling

* **Lucide‑react** for icons

* **Class Variance Authority (cva)** (optional) for simple, typed UI variants

## **Routing**

* **React Router 6.x** (lightweight, single‑page routes like `/tasks`, `/habits`, `/stats`)

## **State Management**

* **Zustand 4.x** for minimal, easy global state (tasks, habits, UI flags)

  * Local component state via React hooks where appropriate

## **Data Persistence (Local‑First)**

* **Dexie 4.x** (IndexedDB wrapper) for persistent storage in the browser

  * Tables: `tasks`, `habits`, `tags`, `events`

  * Sync: **None in v1** (local‑only to keep it simple)

## **Forms & Validation**

* **React Hook Form 7.x** for form handling

* **Zod 3.x** for schema validation (task/habit schemas)

## **Dates & Recurrence**

* **date‑fns 3.x** for date utilities (parsing, formatting)

* **rrule 2.x** for recurring tasks/habits (e.g., daily, weekly)

## **Drag & Drop**

* **@dnd‑kit/core 6.x** for drag‑and‑drop reordering within lists/boards

## **Notifications (Web‑Only)**

* **Web Notifications API** (in‑browser reminders when the app tab is open)

  * **No push or background service** in v1 (keeps scope simple)

  * Optional: use the **Page Visibility API** to surface subtle reminders when user is active

## **Animations / Micro‑interactions**

* **Framer Motion 11.x** for lightweight celebratory animations (e.g., confetti, streak pulses)

## **Testing & Quality**

* **Vitest 1.x** \+ **@testing‑library/react 14.x** for unit/component tests (happy‑path coverage only in v1)

* **ESLint** (typescript \+ react configs) and **Prettier** for formatting

## **Deployment**

* **Vercel** (zero‑config Vite/React deploy, preview URLs for each commit)

---

## **NPM Packages (Pin by Major, use `^` for minor/patch)**

```json
{
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "react-router-dom": "^6.27.0",
    "zustand": "^4.5.0",
    "dexie": "^4.0.6",
    "@dnd-kit/core": "^6.1.0",
    "framer-motion": "^11.2.6",
    "date-fns": "^3.6.0",
    "rrule": "^2.8.1",
    "lucide-react": "^0.468.0",
    "zod": "^3.23.8",
    "react-hook-form": "^7.53.0"
  },
  "devDependencies": {
    "typescript": "^5.6.3",
    "vite": "^5.4.10",
    "@types/react": "^18.3.5",
    "@types/react-dom": "^18.3.0",
    "tailwindcss": "^3.4.14",
    "postcss": "^8.4.49",
    "autoprefixer": "^10.4.20",
    "eslint": "^9.14.0",
    "@typescript-eslint/eslint-plugin": "^8.13.0",
    "@typescript-eslint/parser": "^8.13.0",
    "prettier": "^3.3.3",
    "vitest": "^1.6.0",
    "@testing-library/react": "^14.3.1",
    "@testing-library/user-event": "^14.6.1"
  }
}
```

---

## **Minimal Folder Structure**

```
src/
  app/                      # app shell (providers, router)
  components/               # shared UI components (Button, Card, Tag)
  features/
    tasks/                  # task screens, list, editor
    habits/                 # habit screens, streaks
    dashboard/              # today view, weekly stats
  stores/                   # zustand stores (tasksStore, habitsStore)
  db/                       # dexie schema and adapters
  hooks/                    # useNotifications, useRecurrence, etc.
  utils/                    # date helpers, types, constants
  styles/                   # tailwind.css, globals
  assets/                   # app logo, illustrations
  main.tsx                  # entry (React + Router)
  index.html                # Vite HTML
```

---

## **Why This Stack (Brief)**

* **Beginner‑friendly:** minimal tooling, fast dev server, simple files

* **No backend to manage:** IndexedDB via Dexie keeps v1 local‑first

* **Covers all v1 features:** RRule for recurrence, dnd‑kit for reorder, Notifications API for reminders, Framer Motion for fun gamification

* **Easy to scale later:** Can add Supabase/Firestore for sync, Service Worker for push, and auth when needed

---

This stack is final for v1. If we need changes later, we’ll version the PRD and open a migration task.

