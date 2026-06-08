# 📋 Product Requirements Document — VideoTube Frontend

**Project**: VideoTube Frontend  
**Version**: 1.0  
**Author**: Aftab  
**Status**: In Development  
**Last Updated**: June 2026

---

## 1. Purpose

This document defines the product requirements for the VideoTube Frontend — the browser-based UI layer of the VideoTube platform. It is intended to guide development decisions, page-by-page feature scope, and acceptance criteria.

The frontend must connect seamlessly to the VideoTube Backend REST API and expose all core platform features to end users through a dark, cinematic interface.

---

## 2. Goals

- Deliver a fully functional video platform UI covering discovery, playback, upload, and community features
- Provide a clean, maintainable TypeScript codebase that mirrors the structure of the backend
- Expose AI-powered features (video Q&A, summarization) through intuitive UI panels
- Maintain a single centralized theming system for rapid visual iteration
- Be responsive and usable on both desktop and mobile

---

## 3. Non-Goals (v1.0)

- Native mobile app (iOS / Android)
- Real-time notifications (WebSocket / push)
- Live streaming
- Monetization or payment flows
- Multi-language / i18n support

---

## 4. Users

| User Type | Description |
|---|---|
| **Guest** | Can browse the public feed and watch videos. Cannot upload, comment, or like. |
| **Registered User** | Full access — upload, comment, like, subscribe, manage playlists, view history. |
| **Channel Owner** | All user permissions + can manage their own uploaded videos and channel profile. |

---

## 5. Pages & Feature Requirements

---

### 5.1 Home / Feed

**Route**: `/`  
**Access**: Public

#### Features
- Display a paginated grid of published videos
- Each video card shows: thumbnail, title, channel avatar, channel name, view count, upload date
- Search bar with debounce (300ms) — sends query to backend
- Sort options: Latest, Most Viewed, Oldest
- Skeleton loading state while fetching
- Load more / infinite scroll pagination
- Empty state when no results match search

#### Acceptance Criteria
- [ ] Feed loads within 2 seconds on first visit
- [ ] Search updates results without full page reload
- [ ] Pagination loads next page without losing scroll position
- [ ] Video cards are fully responsive across screen sizes

---

### 5.2 Watch / Player

**Route**: `/watch/:videoId`  
**Access**: Public (interactions require auth)

#### Features
- HTML5 video player with controls (play, pause, seek, volume, fullscreen)
- Video metadata: title, description, view count, upload date
- Channel info: avatar, name, subscriber count
- Subscribe / Unsubscribe button (auth required)
- Like / Unlike toggle with count (auth required)
- Tabbed panel below player:
  - **Comments tab** — list comments, add/edit/delete own comments (auth required)
  - **AI Summary tab** — auto-generated summary from video transcript
  - **Ask AI tab** — chat-style Q&A panel powered by RAG backend

#### Acceptance Criteria
- [ ] Video plays without manual refresh on route load
- [ ] View count increments visually on load (optimistic)
- [ ] Like toggle updates instantly (optimistic UI)
- [ ] Comments load paginated, newest first
- [ ] AI Q&A submits question and streams or displays response
- [ ] Auth-required actions show login prompt for guests

---

### 5.3 Upload

**Route**: `/upload`  
**Access**: Protected (auth required)

#### Features
- Drag-and-drop zone for video file (mp4, mov, webm)
- Thumbnail image upload with preview
- Title field (required, max 100 chars)
- Description field (optional, max 5000 chars)
- Upload progress bar (percentage)
- Submit button disabled until video + title provided
- Success state redirects to the uploaded video's watch page
- Error handling for oversized files or unsupported formats

#### Acceptance Criteria
- [ ] File validation runs before upload starts (type, size)
- [ ] Progress bar reflects real upload progress
- [ ] User cannot navigate away during active upload without confirmation
- [ ] On success, user is redirected to the new video's watch page

---

### 5.4 Login

**Route**: `/login`  
**Access**: Public (redirect to home if already logged in)

#### Features
- Email + password form
- Google OAuth button (redirects to `/api/v1/auth/google`)
- Link to Register page
- "Forgot password?" link → triggers forgot password flow
- Form validation: required fields, email format
- Error messages for invalid credentials
- Loading state on submit

#### Acceptance Criteria
- [ ] Successful login stores access token and redirects to home
- [ ] Invalid credentials show inline error (no page reload)
- [ ] Google OAuth completes and redirects back to the app correctly
- [ ] Already-logged-in users are redirected away from `/login`

---

### 5.5 Register

**Route**: `/register`  
**Access**: Public (redirect to home if already logged in)

#### Features
- Fields: full name, username, email, password, confirm password
- Avatar image upload (required) with preview
- Cover image upload (optional) with preview
- Password strength indicator
- Terms and conditions checkbox
- Form validation — all required fields, password match, email format
- On success: show "Check your email to verify your account" notice

#### Acceptance Criteria
- [ ] Avatar preview updates immediately on file selection
- [ ] Passwords must match before form can be submitted
- [ ] Backend validation errors (e.g. duplicate email) surface inline
- [ ] Email verification notice shown after successful registration

---

### 5.6 Playlist

**Route**: `/playlist/:id`  
**Access**: Public for public playlists; protected for private

#### Features
- Playlist header: name, description, video count, owner
- Ordered list of videos with thumbnail, title, duration
- Play all button — loads first video in watch page
- Owner controls: add video, remove video, edit name/description, delete playlist
- Create new playlist modal (from Navbar or Dashboard)

#### Acceptance Criteria
- [ ] Videos listed in correct playlist order
- [ ] Remove video updates list immediately (optimistic)
- [ ] Private playlists return 403 for non-owners
- [ ] Create playlist form validates name as required

---

### 5.7 Profile / Dashboard

**Route**: `/profile/:username` (public channel view)  
**Route**: `/dashboard` (own dashboard, protected)

#### Features

**Public Channel View**
- Cover image, avatar, channel name, subscriber count
- Subscribe / Unsubscribe button (auth required)
- Tabs: Videos, Playlists

**Own Dashboard**
- All public view features
- Edit profile button → modal for name, bio, avatar, cover image
- Tabs: Videos, Playlists, Watch History, Liked Videos
- Video management: edit title/description, toggle publish, delete

#### Acceptance Criteria
- [ ] Profile loads from `:username` param — not just logged-in user
- [ ] Subscriber count updates immediately on subscribe/unsubscribe (optimistic)
- [ ] Edit profile changes are reflected immediately after save
- [ ] Dashboard tabs persist on page refresh (via URL query param or localStorage)

---

## 6. Shared / Cross-cutting Requirements

### 6.1 Authentication

- Access token stored in memory (React context), not localStorage
- Refresh token handled via HTTP-only cookies (managed by browser automatically)
- On `401` from API: attempt token refresh → retry original request → on failure, redirect to `/login`
- Protected routes redirect unauthenticated users to `/login` with a `?redirect` param

### 6.2 Global State

| State | Managed By |
|---|---|
| Logged-in user | `AuthContext` |
| Access token | `AuthContext` |
| Toast notifications | `ToastContext` (or shadcn `Sonner`) |

### 6.3 Error Handling

- All API errors surface as toast notifications
- 401 errors trigger silent token refresh, not a toast
- 403 errors show "You don't have permission" inline
- 404 errors show a "Not Found" page
- Network errors show a retry option

### 6.4 Loading States

Every data-fetching operation must have:
- A skeleton loader (not a spinner) for initial page load
- A button loading spinner for user-triggered actions
- An empty state component for zero-result queries

### 6.5 Responsiveness

- Mobile-first layout
- Navbar collapses to hamburger menu on small screens
- Video grid: 4 cols desktop → 2 cols tablet → 1 col mobile

---

## 7. TypeScript Interface Contract

All frontend types must match the backend response shapes:

```typescript
interface User {
  _id: string
  username: string
  fullName: string
  email: string
  avatar: string
  coverImage?: string
  subscribersCount: number
  isSubscribed: boolean
}

interface Video {
  _id: string
  title: string
  description: string
  thumbnail: string
  videoFile: string
  duration: number
  views: number
  isPublished: boolean
  owner: User
  createdAt: string
}

interface Comment {
  _id: string
  content: string
  owner: User
  createdAt: string
}

interface Playlist {
  _id: string
  name: string
  description?: string
  videos: Video[]
  owner: User
}
```

---

## 8. Milestones

| Phase | Scope | Status |
|---|---|---|
| **Phase 0** | Project setup, routing, CSS variables, Axios, AuthContext | 🔄 In Progress |
| **Phase 1** | Login, Register pages | ⬜ Pending |
| **Phase 2** | Home feed with search and pagination | ⬜ Pending |
| **Phase 3** | Watch page — player, metadata, likes, subscribe | ⬜ Pending |
| **Phase 4** | Comment system | ⬜ Pending |
| **Phase 5** | Upload flow | ⬜ Pending |
| **Phase 6** | Profile / Dashboard | ⬜ Pending |
| **Phase 7** | Playlist management | ⬜ Pending |
| **Phase 8** | AI panels — Q&A and Summary | ⬜ Pending |
| **Phase 9** | Responsive polish + empty/error states | ⬜ Pending |

---

## 9. Out of Scope for v1.0

- Dark / light mode toggle (dark-only for v1)
- Video chapters UI (backend planned but not yet complete)
- Comment sentiment overview (backend pending)
- Notifications system

---

*This document should be updated as features are built and requirements evolve.*