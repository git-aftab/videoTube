# 🎥 VideoTube

> A full-stack, YouTube-inspired video platform — production-grade backend, cinematic frontend, and an AI layer for intelligent content understanding.

[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=flat&logo=node.js)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=flat&logo=react)](https://react.dev)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat&logo=mongodb)](https://mongodb.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat&logo=typescript)](https://typescriptlang.org)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📖 About

VideoTube is a full-stack video sharing platform built from scratch to model real-world production patterns. It goes well beyond typical CRUD tutorials — featuring JWT auth with refresh token rotation, Google OAuth, Cloudinary media management, a BullMQ-powered async processing pipeline (audio extraction → transcription → embeddings), and a RAG layer for AI-powered video Q&A and summarization.

This is a personal full-stack project built as a deep-dive into backend architecture, async workers, vector search, and modern frontend development.

---

## 🗂️ Repository Structure

```
videoTube/
├── VideoTube_Backend/     # Node.js + Express REST API
└── VideoTube_Frontend/    # React + TypeScript + Tailwind UI
```

Each directory has its own `README.md` with full setup instructions, architecture details, and API references.

---

## ✨ Feature Highlights

### Backend
- **JWT Auth** — access + refresh token pair with rotation and per-device invalidation
- **Google OAuth** — Passport.js strategy with automatic user creation
- **Email flows** — verification on register, forgot/reset password via tokenized links
- **Video pipeline** — upload → Cloudinary → BullMQ workers → ffmpeg audio extraction → Groq Whisper transcription → Jina AI embeddings → Qdrant vector storage
- **RAG layer** — semantic search, video Q&A, and summarization from transcripts
- **Redis caching** — hot data caching with TTL
- **Rate limiting** — per-IP and per-user request throttling
- **Clean architecture** — controllers, routes, middleware, validators, models each with single responsibility

### Frontend
- **Dark cinematic UI** — black background, purple accent system, CSS variable theming
- **Full auth UI** — login, register (with avatar upload), Google OAuth, email verification, password reset
- **Video feed** — paginated grid with debounced search and sort
- **Watch page** — HTML5 player, likes, subscriptions, comments, AI Q&A panel, AI summary
- **Upload flow** — drag-and-drop with progress tracking
- **Profile / Dashboard** — channel management, video CRUD, watch history, liked videos
- **Playlist management** — create, edit, reorder, share

---

## 🛠️ Full Tech Stack

### Backend
| Layer | Technology |
|---|---|
| Runtime | Node.js 18.x |
| Framework | Express.js |
| Database | MongoDB Atlas + Mongoose |
| Cache | Redis |
| Queue | BullMQ |
| Auth | JWT, Passport.js (Google OAuth) |
| File upload | Multer → Cloudinary |
| Media processing | ffmpeg (audio extraction) |
| Transcription | Groq Whisper |
| Embeddings | Jina AI |
| Vector DB | Qdrant |
| Email | Nodemailer + Mailtrap (dev) |
| Validation | express-validator |
| Logging | Winston + Morgan |

### Frontend
| Layer | Technology |
|---|---|
| Framework | React 19 + Vite |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui (Radix) |
| Routing | React Router v7 |
| HTTP | Axios |
| Icons | Lucide React |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- Cloudinary account
- Redis (local or cloud)
- Qdrant (local Docker or cloud)

### 1. Clone the repository

```bash
git clone https://github.com/git-aftab/videoTube.git
cd videoTube
```

### 2. Start the Backend

```bash
cd VideoTube_Backend
npm install
cp .env.sample .env
# Fill in your environment variables
npm run dev
```

Backend runs at `http://localhost:3000`

### 3. Start the Frontend

```bash
cd VideoTube_Frontend
npm install
# Create .env with VITE_API_BASE_URL=http://localhost:3000/api/v1
npm run dev
```

Frontend runs at `http://localhost:5173`

> See each subdirectory's README for complete environment variable reference and architecture details.

---

## 🤖 AI Pipeline Overview

```
Video Upload
     │
     ▼
Cloudinary (video + thumbnail storage)
     │
     ▼
BullMQ Worker 1 — Audio Extraction (ffmpeg)
     │
     ▼
BullMQ Worker 2 — Transcription (Groq Whisper)
     │
     ▼
BullMQ Worker 3 — Embedding + Indexing (Jina AI → Qdrant)
     │
     ▼
RAG Endpoints — Q&A, Summarization, Semantic Search
```

---

## 📊 Backend API Summary

| Resource | Base Route |
|---|---|
| Auth | `/api/v1/auth` |
| Videos | `/api/v1/videos` |
| Comments | `/api/v1/comments` |
| Likes | `/api/v1/likes` |
| Playlists | `/api/v1/playlists` |
| Subscriptions | `/api/v1/subscriptions` |
| Tweets | `/api/v1/tweets` |
| Users | `/api/v1/users` |
| AI / RAG | `/api/v1/ai` |

Full API reference in [`VideoTube_Backend/README.md`](./VideoTube_Backend/README.md)

---

## 🔮 Roadmap

### Backend
- [x] JWT auth with refresh token rotation
- [x] Google OAuth
- [x] Email verification + password reset
- [x] Video upload + Cloudinary integration
- [x] Video feed with search, sort, pagination
- [x] Comments, Likes, Playlists, Subscriptions, Tweets
- [x] BullMQ async pipeline (audio → transcription → embeddings)
- [x] RAG — Q&A and summarization endpoints
- [x] Redis caching
- [x] Rate limiting
- [x] Semantic search
- [ ] Comment sentiment overview

### Frontend
- [x] Project setup — Vite, TypeScript, Tailwind, shadcn, Router
- [ ] Auth pages — Login, Register, Reset Password
- [ ] Home feed
- [ ] Watch page
- [ ] Upload flow
- [ ] Profile / Dashboard
- [ ] Playlist management
- [ ] AI Q&A and Summary panels
- [ ] Responsive mobile layout

---

## 🧠 Key Learnings

- Designing stateless auth systems with token rotation and multi-device support
- Building async worker pipelines with BullMQ — job isolation, retries, and failure handling
- RAG pipeline from scratch — chunking, embedding, vector search, and grounded response generation
- MongoDB aggregation pipelines for complex relational queries in a NoSQL context
- TypeScript on the frontend — writing interfaces that match backend response contracts

---

## 👤 Author

Built by [Aftab](https://github.com/git-aftab) as a full-stack deep-dive project under [Nexcraft](https://github.com/git-aftab).

---

<p align="center">⭐ Star this repo if it helped you learn something!</p>
