# 🧠 WisdomHub – A Board Management App

Welcome to **WisdomHub**, my take on a lightweight, elegant board management tool inspired by Trello. This project was designed to demonstrate full-stack engineering skills and deliver an intuitive experience for both users and developers inspecting the codebase.

Built with **Next.js 15**, **TypeScript**, and **MongoDB**, this app features manual authentication, drag-and-drop functionality using `@dnd-kit`, dark/light theme support, and polished UX with skeleton loaders and empty states.

---

## 🚀 Why I Built WisdomHub

This project was created as part of a 24-hour full-stack challenge. The goal was to build the **first usable slice** of a collaborative board app, focusing on both:

- 👩‍💼 **User Experience** – what a manager/team member would interact with
- 👨‍💻 **Engineering Craft** – what a senior developer would evaluate in code

Rather than relying on tools like Auth0 or Firebase, I implemented **manual auth**, session handling, and CSRF protection myself to ensure maximum control over the backend.

---

From the earliest **low-fidelity sketches** to refined **mid-/high-fidelity wireframes**, everything started in Figma—here’s the design journey:
[Figma wireframes (low to mid‑hi fidelity)](https://www.figma.com/design/OtTMPA3QKOmArcjhu48Tb6/BoardHub?node-id=0-1&m=dev&t=kFsfVhuG3nOXEpmb-1)

---

##  My Design Journey

###  Low-Fi to High-Fi Wireframes in Figma
I began with **low-fidelity wireframes**—simple, grayscale layouts that helped me quickly explore structure and user flow with minimal friction :contentReference[oaicite:0]{index=0}. These early sketches made it easy to iterate rapidly and align my thinking before diving into visuals.

As clarity emerged, I evolved the designs to **mid-fidelity wireframes**, which added layout hierarchy, spacing, and more realistic proportions—without committing to full polish :contentReference[oaicite:1]{index=1}. The link above shows how the design matured over time, guiding development and ensuring the UI wasn't just functional but also thought-through.

---

## 🔧 Features Overview

### 🔐 Authentication
I implemented manual auth from scratch using:
- **bcryptjs** for password hashing
- **cookies** for secure session handling
- **CSRF tokens** to protect form submissions

Users can **register**, **log in**, and **stay signed in** across sessions.

---

### 🏠 Dashboard
Once logged in, users are directed to a **dashboard** that displays all their boards. Key capabilities:
- ✅ Create new boards
- 📝 Edit board names
- ❌ Delete boards
- ✨ Beautiful card-based layout with Tailwind
- ⏳ Skeleton loaders while data fetches

---

### 🗂 Board View
Each board contains **lists** and **cards**, which I built using MongoDB's flexible document structure. You can:
- Add, rename, delete **lists**
- Add, rename, delete **cards**
- Reorder both using smooth **drag and drop** (via `@dnd-kit`)
- Move cards between lists
- Get real-time visual feedback when dragging

---

### 🌗 Theme Toggle
I added support for:
- **Light and dark modes**
- **System preference detection**
- **Manual toggling** from anywhere in the app

Tailwind’s utility-first approach made it seamless to implement consistent theming.

---

### 💤 Loading & Empty States
Good UX isn’t just about functionality. I also included:
- **Skeleton loaders** while data is fetching
- **Encouraging empty states** when a board, list, or card doesn’t exist yet
- A **global error boundary** and a custom 404 page

---

## 🧱 Tech Stack

| Layer         | Technology           |
|---------------|----------------------|
| Frontend      | Next.js 15, React 19, Tailwind CSS, TypeScript |
| Backend       | Next.js API Routes / Server Actions |
| Database      | MongoDB (via native driver) |
| Auth          | bcryptjs, cookie, csrf |
| Drag & Drop   | `@dnd-kit` |
| Theming       | `next-themes` |
| Logging       | `pino` |
| State Mgmt    | React Hooks |

---

## 📁 Project Structure

```bash
src/
├── app/
│   ├── api/            # API routes (auth, boards, lists, cards)
│   ├── dashboard/      # Main dashboard page
│   ├── board/[id]/     # Individual board view
│   ├── login/          # Login page
│   └── register/       # Registration page
├── components/         # Reusable UI components
├── lib/                # DB connection, auth, CSRF helpers
├── models/             # MongoDB models (Board, List, Card, User)
├── types/              # TypeScript types
└── utils/              # Logging, error handling
