# 🎬 VideoTube Frontend

> A dark, cinematic video platform UI built with React, TypeScript, and Tailwind CSS — designed as the consumer-facing layer for the VideoTube backend.

[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=flat&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat&logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=flat&logo=tailwindcss)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=flat&logo=vite)](https://vitejs.dev)

---

## 📖 Overview

VideoTube Frontend is the complete UI layer for the VideoTube platform — a YouTube-inspired video sharing application. Built with a black and purple aesthetic, it connects to the VideoTube REST API for all data operations including auth, video streaming, uploads, playlists, subscriptions, and AI-powered features.

The frontend is designed with a **central CSS variable system** for effortless theming, clean TypeScript interfaces mapped to backend models, and a modular component architecture for long-term maintainability.

---

## 🏗️ Project Structure

```
src/
├── components/
│   ├── Layout/
│   │   ├── Navbar.tsx          # Top navigation bar
│   │   └── Footer.tsx          # Site footer
│   ├── shared/                 # Reusable components
│   │   ├── VideoCard.tsx       # Video thumbnail + metadata card
│   │   ├── Avatar.tsx          # User avatar with fallback
│   │   ├── Loader.tsx          # Skeleton / spinner states
│   │   └── ProtectedRoute.tsx  # Auth guard wrapper
│   └── ui/                     # shadcn/ui auto-generated components
├── pages/
│   ├── Home.tsx                # Video feed / discovery
│   ├── Watch.tsx               # Video player + comments + AI Q&A
│   ├── Upload.tsx              # Video upload flow
│   ├── Login.tsx               # Email + Google OAuth login
│   ├── Register.tsx            # Registration with avatar upload
│   ├── Playlist.tsx            # Playlist view and management
│   └── Profile.tsx             # User channel / dashboard
├── context/
│   └── AuthContext.tsx         # Global auth state (user, token, logout)
├── hooks/
│   ├── useAuth.ts              # Access auth context
│   ├── useVideos.ts            # Fetch paginated video feed
│   └── useDebounce.ts          # Search input debouncing
├── services/
│   └── axios.ts                # Axios instance with interceptors
├── types/
│   └── index.ts                # TypeScript interfaces for all models
└── assets/                     # Static assets
```

---

## 🎨 Design System

### Color Palette

All colors are controlled from a single source in `src/index.css`:

```css
:root {
  --bg-primary:    #0a0a0a;   /* Main background */
  --bg-secondary:  #111111;   /* Cards, panels */
  --bg-elevated:   #1a1a1a;   /* Modals, dropdowns */
  --accent:        #7c3aed;   /* Primary purple */
  --accent-hover:  #6d28d9;   /* Hover state */
  --accent-soft:   #7c3aed1a; /* Tinted backgrounds */
  --text-primary:  #ffffff;
  --text-muted:    #888888;
  --border:        #222222;
  --error:         #ef4444;
  --success:       #22c55e;
}
```

To retheme the entire app, edit these variables — nothing else needs to change.

### Typography

- **Display**: Syne — used for headings and brand elements
- **Body**: DM Sans — clean and readable for UI text
- **Mono**: JetBrains Mono — timestamps, code, metadata

---

## 🧩 Pages & Features

### 🏠 Home / Feed
- Paginated video grid with search, sort, and filter
- Debounced search bar
- Infinite scroll or load-more pagination
- Skeleton loading states

### 📺 Watch / Player
- Native HTML5 `<video>` player
- Video metadata — title, views, upload date, description
- Subscribe / unsubscribe to channel
- Like / unlike toggle
- Comment section — add, edit, delete
- **AI Q&A panel** — ask questions about the video content (RAG-powered)
- **AI Summary** — auto-generated video summary from transcript

### 📤 Upload
- Drag-and-drop video file selection
- Thumbnail upload
- Title, description fields
- Upload progress indicator
- Connects to BullMQ pipeline on the backend

### 🔐 Login / Register
- Email + password login
- Google OAuth button (redirects to backend Passport flow)
- Registration with avatar + cover image upload
- Email verification notice after registration
- Forgot password → reset password flow

### 📋 Playlist
- View all user playlists
- Create new playlist
- Add / remove videos
- Public and private playlist support

### 👤 Profile / Dashboard
- Channel header — avatar, cover image, subscriber count
- Edit profile — name, bio, avatar, cover image
- Video management tab — user's uploaded videos
- Watch history tab
- Liked videos tab

---

## ⚙️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 with Vite |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| Component Library | shadcn/ui (Radix primitives) |
| Routing | React Router v7 |
| HTTP Client | Axios with interceptors |
| State | React Context (Auth) + local useState |
| Icons | Lucide React |

---

## 🔌 API Integration

All API calls go through `src/services/axios.ts` — a pre-configured Axios instance:

- `baseURL` points to the VideoTube backend (`http://localhost:3000/api/v1`)
- `withCredentials: true` for cookie-based refresh tokens
- Request interceptor attaches the access token from context
- Response interceptor handles `401` — auto-refreshes token and retries

---

## 🚀 Getting Started

```bash
# Navigate to the frontend directory
cd VideoTube_Frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app runs at `http://localhost:5173` by default.

Make sure the VideoTube Backend is running at `http://localhost:3000` before starting the frontend.

### Environment Variables

Create a `.env` file in `VideoTube_Frontend/`:

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

---

## 🗺️ Routing Structure

```
/                    → Home (Feed)
/watch/:videoId      → Watch page
/upload              → Upload (protected)
/login               → Login
/register            → Register
/reset-password      → Password reset (from email link)
/playlist/:id        → Playlist view
/profile/:username   → Public channel / profile
/dashboard           → Own dashboard (protected)
```

---

## 🔮 Roadmap

- [x] Project structure and routing setup
- [x] Axios instance with token interceptors
- [x] Auth context (login, logout, token refresh)
- [ ] Home feed with search and pagination
- [ ] Watch page with video player
- [ ] Comment system
- [ ] Like / Subscribe interactions
- [ ] Upload flow with progress
- [ ] Login / Register pages
- [ ] Google OAuth integration
- [ ] Profile / Dashboard
- [ ] Playlist management
- [ ] AI Q&A panel (RAG integration)
- [ ] AI video summary display
- [ ] Responsive mobile layout

---

<p align="center">Part of the <strong>VideoTube</strong> project · Built by <a href="https://github.com/git-aftab">Aftab</a></p>
