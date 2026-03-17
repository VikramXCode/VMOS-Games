# Project Documentation

## 1. Overview

VMOS is a full-stack gaming venue platform for VMOS Game Station (Tiruppur, India). It combines customer-facing experiences (booking, shopping, tournaments, gallery, leaderboard) with an admin control panel (operations, products, slot controls, customer/revenue views, AI insights).

The system is hybrid:
- Frontend-first UX with lightweight local UI state where appropriate.
- Backend APIs as the source of truth for operational and content data.
- WhatsApp as the final operational channel for booking/order confirmation.
- AI assistants embedded in customer and admin flows.

Primary user roles:
- Customer: browse, reserve slots, explore tournaments, shop items, interact with AI helper.
- Admin: login, monitor bookings/revenue, manage products and slots, manage tournaments, view analytics, run insights.

Core runtime architecture:
- SPA frontend served by Vite (port 8080 in dev), React Router for navigation.
- Express API server (port 3001) connected to MongoDB.
- Cloudinary for product image hosting.
- JWT-based admin authentication.

## 2. Tech Stack

Frontend:
- React 18 + TypeScript
- Vite + SWC
- Tailwind CSS + shadcn/ui + Radix UI
- React Router v6
- Lucide icons

Backend:
- Node.js + Express 5
- Mongoose (MongoDB)
- JWT (jsonwebtoken)
- bcryptjs
- multer (memory upload handling)
- Cloudinary SDK
- CORS + dotenv

AI:
- Groq SDK
- Google Generative AI (Gemini)

Testing/Quality:
- Vitest + Testing Library + jsdom
- ESLint + Prettier

Design System:
- Dark gaming-themed token system in CSS variables
- Font stack: Rajdhani (display), Exo 2 (headings), Inter (body), JetBrains Mono (stats)

## 3. Folder Structure Explained

Root-level:
- package.json: unified scripts for frontend and backend orchestration.
- vite.config.ts: dev server + /api proxy to backend.
- tailwind.config.ts: design tokens and custom animation utilities.
- index.html: SPA shell.

server/:
- index.ts: API bootstrap, middleware setup, route mounting, DB connection lifecycle.
- middleware/auth.ts: token validation and auth request augmentation.
- lib/cloudinary.ts: upload/delete adapter abstraction.
- models/: persistence contract definitions.
- routes/: HTTP endpoint modules grouped by domain.
- seed.ts: sample data bootstrapping and default admin creation.

src/:
- App.tsx: route graph and protected route composition.
- main.tsx: provider tree and global initialization.
- index.css: global design language and utility classes.
- components/: composable UI and feature modules.
- pages/: public and admin route-level screens.
- contexts/: booking, cart, admin, and public content state containers.
- lib/: API and AI client utilities.
- hooks/: shared behavior hooks.

## 4. UI/UX Breakdown

### 4.1 Home
- Purpose: Introduce VMOS brand and drive conversion toward booking/shop/tournaments.
- Components: HeroSection, ServicesSection, LocationSection, ShopPreviewSection, TournamentSection, ContactSection, Header, Footer, ChatWidget.
- Interactions: auto-rotating hero slides, WhatsApp CTAs, mobile-first card/tap patterns.

### 4.2 Booking
- Purpose: Reserve a console slot with live availability confidence.
- Interactions: console/date selection, availability refresh, AI slot suggestion, WhatsApp confirmation.
- Data source: backend availability + booking APIs.

### 4.3 Shop
- Purpose: Browse/filter/search products and convert via cart -> WhatsApp order.
- Interactions: API product fetch, layered filters, cart mutations, WhatsApp checkout.

### 4.4 Tournaments
- Purpose: Promote events and registrations.
- Interactions: API-backed tournament list + status filters + WhatsApp register action.

### 4.5 Gallery
- Purpose: Social proof and ambience showcase.
- Interactions: API-backed gallery, category filters, full-screen lightbox.

### 4.6 Leaderboard
- Purpose: Gamification and community competitiveness.
- Interactions: API-backed leaderboard list with visual filters/podium rendering.

### 4.7 Admin Login
- Purpose: Secure access gate.
- Interactions: async login via AdminContext -> JWT storage -> guarded-route redirect.

### 4.8 Admin Overview
- Purpose: operational snapshot of bookings and revenue.
- Interactions: derived metrics from backend-synced booking state.

### 4.9 Admin Bookings
- Purpose: search/filter and moderate bookings.
- Interactions: backend update/delete actions and status lifecycle controls.

### 4.10 Admin Slots
- Purpose: manual inventory control for slot availability.
- Interactions: backend slot override create/delete + booked-slot protection.

### 4.11 Admin Products
- Purpose: manage catalog and Cloudinary-backed images.
- Interactions: upload image -> create product -> delete with backend cleanup.

### 4.12 Admin Tournaments
- Purpose: manage tournament lifecycle.
- Interactions: load/create/delete through /api/tournaments with auth.

### 4.13 Admin Customers
- Purpose: lifetime behavior view from booking data.

### 4.14 Admin AI Insights
- Purpose: generate operational insights and follow-up answers.

## 5. Component Architecture

High-level provider tree:
- BrowserRouter
- QueryClientProvider
- BookingProvider
- CartProvider
- PublicContentProvider
- AdminProvider
- TooltipProvider

Patterns:
- Stateless presentational components receive explicit props.
- Stateful pages orchestrate fetch/filter/mutation logic.
- API wrapper centralizes auth headers and error conversion.
- Local storage is used intentionally for cart and admin token persistence.

## 6. Navigation and User Flow

Public flow:
1. User lands on Home.
2. Picks a journey: booking, shop, tournaments, gallery, leaderboard.
3. Completes booking/order through WhatsApp deep links.

Admin flow:
1. User visits /admin/login.
2. Login stores JWT token.
3. AdminGuard verifies access on protected routes.
4. Admin performs operations on backend-backed data.

## 7. Backend Architecture

Server composition:
- Express middleware: cors + express.json.
- Route modules mounted under /api.
- Mongoose connection gate before server start.
- Health endpoint for readiness checks.

Auth middleware:
- Extract bearer token.
- Verify JWT.
- Attach adminId for downstream handlers.

Error strategy:
- Route-level try/catch with meaningful HTTP statuses.
- Common responses: 401, 403, 404, 409, 500.

## 8. API Endpoints

Base path: /api

Health:
- GET /health

Admin Auth:
- POST /admin/login
- GET /admin/me
- POST /admin/register

Products:
- GET /products
- GET /products/:id
- POST /products/upload-image (admin)
- POST /products (admin)
- PUT /products/:id (admin)
- DELETE /products/:id (admin)

Bookings:
- GET /bookings (admin)
- GET /bookings/availability
- POST /bookings
- PUT /bookings/:id (admin)
- DELETE /bookings/:id (admin)

Tournaments:
- GET /tournaments
- POST /tournaments (admin)
- PUT /tournaments/:id (admin)
- DELETE /tournaments/:id (admin)

Leaderboard:
- GET /leaderboard
- POST /leaderboard (admin)
- PUT /leaderboard/:id (admin)
- DELETE /leaderboard/:id (admin)

Slots:
- GET /slots/overrides
- POST /slots/overrides (admin)
- DELETE /slots/overrides/:id (admin)

Consoles:
- GET /consoles

Content:
- GET /content/public

## 9. Database Design

Collections and key fields:
- Admin: username (unique), password hash, role.
- Product: name, price, image, imagePublicId, category, description, inStock.
- Booking: customerName/customerPhone, consoleId/consoleName, date/startTime/endTime, price, status.
- Tournament: name, game, date, time, entryFee, prizePool, maxSlots, filledSlots, status, icon, gradient.
- LeaderboardEntry: player identity + metrics.
- SlotOverride: consoleId, date, startTime optional, blocked flag.
- Console: id, name, icon, pricePerHour, active.
- SiteContent: hero/services/location/contact/gallery payloads.

Indexes and constraints:
- Booking unique index: consoleId + date + startTime.

## 10. Data Flow

### 10.1 Product Create with Cloudinary
1. Admin uploads image to /api/products/upload-image.
2. Backend uploads to Cloudinary and returns URL/publicId.
3. Frontend creates product via /api/products.
4. Backend persists product.

### 10.2 Slot Booking and Availability
1. Customer selects console/date on booking page.
2. Frontend queries /api/bookings/availability and /api/slots/overrides.
3. Customer selects slot and submits booking to /api/bookings.
4. Unique index blocks duplicate slot writes.
5. Admin moderates status via /api/bookings/:id.

### 10.3 Admin Authentication
1. Admin submits credentials to /api/admin/login.
2. Backend validates and returns JWT.
3. Frontend stores token and validates via /api/admin/me on protected routes.

## 11. Key Features

- Booking system with live slot availability and admin slot controls.
- Commerce flow with Cloudinary-backed products and WhatsApp checkout.
- Tournament and leaderboard modules fully API-backed.
- Public home/gallery/contact content delivered from backend content endpoint.
- AI assistants for customer help and admin insights.

## 12. Setup Instructions

Prerequisites:
- Node.js 18+
- MongoDB
- Cloudinary account
- Optional AI API keys (Groq/Gemini)

Environment variables:
- MONGODB_URI
- JWT_SECRET
- PORT (optional)
- CLOUDINARY_CLOUD_NAME
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET
- CLOUDINARY_FOLDER (optional)
- VITE_GROQ_API_KEY
- VITE_GEMINI_API_KEY

Install:
- npm install

Seed:
- npm run seed
- Creates sample products, tournaments, leaderboard entries, consoles, site content, and default admin.

Run:
1. npm run server
2. npm run dev
3. Open http://localhost:8080

Validation:
- npm run build
- npm run lint
- npm run test

## 13. Current Risks and Roadmap

Current risks:
- AI calls still occur directly from the browser for some features.
- Server-side payload validation can be expanded.
- Test coverage is still minimal.

Recommended roadmap:
1. Move AI invocations server-side with rate limiting.
2. Add schema validation for write endpoints.
3. Expand automated unit/integration/e2e coverage.
4. Add structured logging and error tracking.

Assumptions:
- WhatsApp is a deliberate operating channel.
- Deployment target is moderate traffic, monolithic runtime.
- Dark theme is the current brand direction.
