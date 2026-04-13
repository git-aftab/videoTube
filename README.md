# 🎥 VideoTube

> A production-grade, YouTube-inspired backend engineered for scale — built with real-world architecture patterns, intelligent AI features, and clean separation of concerns.

[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=flat&logo=node.js)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat&logo=express)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat&logo=mongodb)](https://mongodb.com)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Media-3448C5?style=flat&logo=cloudinary)](https://cloudinary.com)

---

## 📖 Overview

VideoTube goes beyond typical CRUD tutorials. It's an attempt to model a real-world video platform backend with production-level patterns:

- **Scalable MongoDB schema design** — referencing vs embedding trade-offs, polymorphic associations, indexing strategies
- **Secure multi-strategy authentication** — JWT-based auth + Google OAuth, refresh token rotation, email verification
- **AI-powered content intelligence** — RAG pipeline for video summarization, Q&A, and comment analysis *(in progress)*
- **Clean layered architecture** — controllers, routes, middleware, validators, models — each with a single responsibility

---

## 🏗️ Architecture

```
src/
├── config/          # Passport OAuth, environment setup
├── controllers/     # Business logic (auth, video, comments, likes...)
├── db/              # MongoDB connection
├── middlewares/     # JWT verification, ownership checks, file uploads, validation
├── models/          # Mongoose schemas (User, Video, Comment, Like, Playlist, Subscription, Tweet)
├── routes/          # Express routers
├── utils/           # ApiError, ApiResponse, asyncHandler, Cloudinary, Mailer
└── validators/      # express-validator rule sets per route
```

---

## 🧩 Core Modules

### 👤 Auth & Users
- Register / Login / Logout with JWT (access + refresh token pair)
- Refresh token rotation — invalidation on logout, per-device control
- Email verification on registration via tokenized link (SHA-256 hashed, expiry-aware)
- Forgot password + reset password flow
- Google OAuth via Passport.js — auto user creation, loginType tracking
- Profile management — avatar + cover image upload via Cloudinary
- Watch history tracking

### 🎬 Videos
- Upload video + thumbnail (Multer → Cloudinary pipeline)
- Metadata management — title, description, duration (auto-extracted from Cloudinary)
- View count tracking (`$inc` on fetch)
- Publish / unpublish toggle
- Ownership-protected update and delete with Cloudinary cleanup

### 💬 Comments
- Scalable comment structure linked to videos and users
- Ownership-protected edit and delete

### ❤️ Likes
- Polymorphic design — like videos, comments, and tweets from a single model
- Toggle like/unlike

### 🐦 Tweets (Community Posts)
- Lightweight content sharing — similar to YouTube community posts
- Ownership-protected CRUD

### 📂 Playlists
- User-defined video collections
- Efficient many-to-many relationship handling
- Add / remove videos, fetch user playlists

### 🔔 Subscriptions
- Channel subscription system (User ↔ User)
- Subscriber count and subscription status queries

---

## 🤖 AI Features *(Planned / In Progress)*

VideoTube is being extended with a **RAG (Retrieval-Augmented Generation)** layer for intelligent content understanding:

| Feature | Description | Status |
|---|---|---|
| **Video Summarization** | Auto-generate concise summaries from video transcripts | 🔄 Planned |
| **Video Q&A** | Ask questions about a video's content, get grounded answers | 🔄 Planned |
| **Comment Intelligence** | Summarize hundreds of comments into a sentiment overview | 🔄 Planned |
| **Semantic Search** | Search videos by meaning, not just keywords | 🔄 Planned |
| **Chapter Generation** | Auto-detect topics and generate timestamped chapters | 🔄 Planned |

**Planned AI Stack:**
- **Vector DB** — pgvector / Qdrant for embedding storage
- **Embeddings** — OpenRouter / OpenAI embedding models
- **LLM** — Groq (fast inference) for Q&A and summarization
- **Transcript Pipeline** — Whisper / AssemblyAI for audio-to-text

---

## 🛠️ Tech Stack

### Core
| Layer | Technology |
|---|---|
| Runtime | Node.js 18.x |
| Framework | Express.js |
| Database | MongoDB Atlas + Mongoose |
| ODM | Mongoose with aggregation pipelines |

### Auth & Security
| Feature | Technology |
|---|---|
| Authentication | JWT (access + refresh token) |
| OAuth | Passport.js (Google strategy) |
| Password hashing | bcrypt |
| Input validation | express-validator |

### File Handling
| Feature | Technology |
|---|---|
| Upload middleware | Multer (disk storage → temp) |
| Cloud storage | Cloudinary (images + videos) |
| Cleanup | Auto-delete on update/delete |

### Email
| Feature | Technology |
|---|---|
| Transport | Nodemailer + Mailtrap (dev) |
| Templates | Mailgen |

### Dev Tools
| Tool | Purpose |
|---|---|
| Nodemon | Hot reload in development |
| Postman | API testing |
| Winston | Structured logging |
| Morgan | HTTP request logging |

---

## 🔐 Security Design

- **JWT refresh token rotation** — new refresh token issued on every refresh, old one invalidated
- **Email verification tokens** — SHA-256 hashed in DB, unhashed sent in email link, expiry enforced
- **Ownership middleware** — `verifyOwnership(Model, paramName)` reusable across all protected resources
- **OAuth loginType guard** — email/password login blocked for OAuth-registered users
- **Cloudinary cleanup** — old files deleted on every update to prevent orphaned storage

---

## 📊 Database Design Highlights

- **Polymorphic Likes** — single `Like` model references videos, comments, or tweets via a `type` field
- **Subscription modeling** — `Subscription` stores `subscriber → channel` pairs for efficient fan-out queries
- **Aggregation pipelines** — `$lookup`, `$match`, `$sort`, `$addFields` used across video and user queries
- **Paginated aggregations** — `mongoose-aggregate-paginate-v2` for cursor-based pagination on video feeds

---

## ⚙️ API Overview

### Auth Routes — `/api/v1/auth`
```
POST   /register                  Register with avatar + cover image
POST   /login                     Login with email/username + password
POST   /logout                    Logout (JWT required)
GET    /verify-email/:token       Verify email from link
POST   /resend-email-verification Resend verification email
POST   /refresh-token             Rotate access + refresh tokens
POST   /forgot-password           Send password reset email
POST   /reset-password/:token     Reset password
POST   /change-password           Change current password (JWT required)
GET    /google                    Initiate Google OAuth
GET    /google/callback           Google OAuth callback
```

### Video Routes — `/api/v1/videos`
```
GET    /                          Get all videos (search, filter, sort, paginate)
POST   /                          Publish a video (JWT required)
GET    /:videoId                  Get video by ID + increment views
PATCH  /:videoId                  Update title, description, thumbnail (owner only)
DELETE /:videoId                  Delete video + Cloudinary files (owner only)
PATCH  /:videoId/toggle-publish   Toggle publish status (owner only)
```

---

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/git-aftab/videoTube.git

# Navigate into the project
cd videoTube

# Install dependencies
npm install

# Copy environment variables
cp .env.sample .env
# Fill in your values (MongoDB URI, JWT secrets, Cloudinary, Mailtrap, Google OAuth)

# Run development server
npm run dev
```

### Required Environment Variables

```env
# Server
PORT=3000
BASE_URL=http://localhost:3000
CLIENT_URL=http://localhost:5173

# MongoDB
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.xxxx.mongodb.net/videoTube

# JWT
ACCESS_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRY=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Mailtrap (dev email testing)
MAILTRAP_SMTP_HOST=sandbox.smtp.mailtrap.io
MAILTRAP_SMTP_PORT=2525
MAILTRAP_SMTP_USER=
MAILTRAP_SMTP_PASS=

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:3000/api/v1/auth/google/callback

# Password Reset
FORGOT_PASSWORD_REDIRECT_URL=http://localhost:5173/reset-password
```

---

## 🔮 Roadmap

- [x] JWT authentication with refresh token rotation
- [x] Email verification + forgot password flow
- [x] Google OAuth
- [x] Video upload + Cloudinary integration
- [x] Aggregation-based video feed with search, sort, pagination
- [x] Ownership middleware
- [x] Input validation with express-validator
- [ ] Comments, Likes, Playlists, Subscriptions, Tweets
- [ ] RAG pipeline — video transcript ingestion + vector embeddings
- [ ] Video Q&A and summarization endpoints
- [ ] Comment sentiment overview
- [ ] Redis caching layer
- [ ] Rate limiting
- [ ] Semantic search
- [ ] Microservices exploration

---

## 🧠 Key Learnings

- Designing auth systems beyond basic login — token rotation, OAuth, email verification
- MongoDB aggregation pipelines for complex relational queries in a NoSQL database
- Middleware composition for clean separation — auth, ownership, validation, file handling
- Cloudinary integration with proper cleanup lifecycle
- Structuring backends for extensibility — adding AI features without restructuring core

---

<p align="center">Built by <a href="https://github.com/git-aftab">Aftab</a> With ❤️</p>
