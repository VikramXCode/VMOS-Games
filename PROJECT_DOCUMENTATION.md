# Project Documentation

## 1. Overview

VMOS is a full-stack gaming venue platform for VMOS Game Station (Tiruppur, India). It combines customer-facing experiences (booking, shopping, tournaments, gallery, leaderboard) with an admin control panel (operations, products, slot controls, customer/revenue views, AI insights).

The system is intentionally hybrid:
- Frontend-first UX with fast local state for booking/cart interactions.
- Backend APIs for persistent entities (products, bookings, tournaments, leaderboard, admin auth, slot overrides).
- WhatsApp as the final operational channel for booking/order confirmation.
- AI assistants embedded in multiple flows for recommendations and operator support.

Primary user roles:
- Customer: browse, reserve slots, explore tournaments, shop items, interact with AI helper.
- Admin: login, monitor bookings/revenue, manage products and slots, view analytics, run insights.

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
- TanStack React Query (provider present; local state still dominant)
- Lucide icons

Backend:
- Node.js + Express 5
- Mongoose (MongoDB)
- JWT (jsonwebtoken)
- bcryptjs for password hashing
- multer (memory upload handling)
- Cloudinary SDK
- CORS + dotenv

AI:
- Groq SDK (client-side, browser usage enabled)
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
- vite.config.ts: dev server + /api proxy routing to backend.
- tailwind.config.ts: design tokens and custom animation utilities.
- index.html: SPA shell.

server/:
- index.ts: API bootstrap, middleware setup, route mounting, DB connection lifecycle.
- middleware/auth.ts: token validation and auth request augmentation.
- lib/cloudinary.ts: upload/delete adapter abstraction.
- models/: persistence contract definitions.
- routes/: HTTP endpoint modules grouped by domain.
- seed.ts: deterministic sample data bootstrapping and default admin creation.

src/:
- App.tsx: route graph and protected route composition.
- main.tsx: provider tree and global initialization.
- index.css: global design language and utility classes.

src/components/:
- home/: homepage section modules for composable landing-page assembly.
- layout/: app-wide scaffold (header/footer/main container).
- admin/: admin shell, sidebar, route protection wrappers.
- ai/: reusable AI assistants plugged into multiple screens.
- shop/: cart drawer and commerce interaction overlay.
- ui/: shadcn/Radix primitives powering consistency and accessibility.

src/pages/:
- Public screens and admin screens as route-level composition units.

src/contexts/:
- Domain state containers (booking, cart, admin session).

src/lib/:
- API client and AI client utilities.

src/hooks/:
- Shared behavior hooks (local storage persistence, responsive helpers, toast helpers).

src/test/:
- Base test setup and example smoke test.

Important practical note:
- The repository currently includes both old and new component files in git history, while the active runtime uses the newer set shown in the current workspace tree (for example, home sections currently use TournamentSection.tsx, and cart state uses CartContext.tsx).

## 4. UI/UX Breakdown

### 4.1 Page: Home
- Purpose:
  - Introduce VMOS brand, drive bookings, surface services/shop/tournaments/contact in one scroll path.
- Layout:
  - Fixed top navbar.
  - Full-bleed hero slider with gradient overlays and dual CTA.
  - Services grid (mobile-square cards).
  - Location map card with actions.
  - Shop preview horizontal product rail.
  - Tournament promo block.
  - Contact stack + social buttons.
  - Footer + floating WhatsApp button + floating AI chat trigger.
- Components:
  - HeroSection, ServicesSection, LocationSection, ShopPreviewSection, TournamentSection, ContactSection, Header, Footer, ChatWidget.
- Interactions:
  - Auto-rotating hero images with manual controls.
  - Smooth scroll to services from hero CTA.
  - WhatsApp launches from multiple CTAs.
  - Shop preview View All routes to shop page.
  - Mobile-first tap targets and rounded card surfaces.

### 4.2 Page: Booking
- Purpose:
  - Let users reserve a console slot quickly with live availability confidence.
- Layout:
  - Header/title panel.
  - Step 1 card: console and date selection.
  - Live refresh row + availability legend.
  - Step 2 card: AI slot suggestion + slot grid.
  - Step 3 summary card appears after slot selection.
- Components:
  - Calendar popover, Select dropdown, SlotSuggester, summary panel, WhatsApp confirmation button.
- Interactions:
  - Availability refresh every 30 seconds and on-demand refresh.
  - Slot selection toggles state visually.
  - AI suggests top slots from currently available list.
  - Final action opens prefilled WhatsApp booking intent.
- Responsiveness:
  - Compact mobile cards and dense slot grid; expands to wider matrix on larger breakpoints.
- Visual hierarchy:
  - Primary focus: console/date controls -> slot availability -> summary total.

### 4.3 Page: Shop
- Purpose:
  - Browse products, filter/search, get AI product matching, convert via cart -> WhatsApp order.
- Layout:
  - Header with cart button and item badge.
  - Search bar.
  - Category chip filters.
  - AI ProductSearch panel.
  - Product grid cards.
  - Empty state and WhatsApp inquiry CTA.
  - CartDrawer overlay.
- Components:
  - ProductSearch, CartDrawer, Button/Input primitives.
- Interactions:
  - API product fetch with fallback to local defaults.
  - Category + text + AI filtering layered together.
  - Add-to-cart toggles button state to Added.
  - Cart drawer supports quantity edits, remove, clear, WhatsApp checkout.

### 4.4 Page: Tournaments
- Purpose:
  - Promote recurring competitive events and registrations.
- Layout:
  - Header + status filters.
  - Featured championship banner.
  - Tournament card list with progress bars and action buttons.
- Components:
  - Tournament cards, filter pills, status badges.
- Interactions:
  - Filter by all/upcoming/completed.
  - Register button launches WhatsApp with tournament-specific message.

### 4.5 Page: Gallery
- Purpose:
  - Social proof and ambience showcase.
- Layout:
  - Header + category filters.
  - Masonry-style image columns.
  - Full-screen lightbox modal.
- Components:
  - Masonry cards, lightbox controls, keyboard listeners.
- Interactions:
  - Click image to open lightbox.
  - Arrow key navigation and escape-to-close.
  - Prev/next controls in overlay.

### 4.6 Page: Leaderboard
- Purpose:
  - Gamification and community competitiveness.
- Layout:
  - Header + time filter chips.
  - Podium for top 3.
  - Aggregate stats cards.
  - Rank list cards for remaining players.
- Components:
  - Podium module, stat cards, ranking rows.
- Interactions:
  - Time filter toggles visual state (data currently static mock).

### 4.7 Page: Admin Login
- Purpose:
  - Secure access gate for operations.
- Layout:
  - Centered branded card with top gradient strip and icon block.
  - Username/password fields, submit button, helper footer text.
- Components:
  - Card/Input/Label/Button from UI kit.
- Interactions:
  - Async login via AdminContext -> JWT storage -> redirect to requested route or overview.

### 4.8 Page: Admin Overview
- Purpose:
  - Operational snapshot of bookings and revenue.
- Layout:
  - Section intro.
  - Four stat cards.
  - Recent bookings list card.
- Components:
  - AdminLayout shell + stat card helper + bookings list.
- Interactions:
  - Derived metrics computed from booking context.

### 4.9 Page: Admin Bookings
- Purpose:
  - Search/filter all bookings and perform moderation actions.
- Layout:
  - Title card with icon.
  - Search input + status filter.
  - Booking rows with status pill and action buttons.
- Components:
  - Input + Select + action buttons (confirm/cancel/delete).
- Interactions:
  - Live local filtering by text and status.
  - Per-row mutation actions update booking state.

### 4.10 Page: Admin Slots
- Purpose:
  - Manual inventory control for slot availability.
- Layout:
  - Console selector + date picker + bulk block/unblock actions.
  - Slot state grid.
- Components:
  - Select, date input, stateful slot buttons.
- Interactions:
  - Click available/blocked slot to toggle admin block.
  - Booked slots disabled.
  - Whole-day block/unblock controls.

### 4.11 Page: Admin Products
- Purpose:
  - Manage product catalog and Cloudinary-backed images.
- Layout:
  - Two-column desktop layout:
    - Left: product creation form + image upload preview.
    - Right: existing product cards with remove action.
- Components:
  - File input, API upload action, product listing card group.
- Interactions:
  - Image upload -> Cloudinary URL/publicId -> product create.
  - Delete product triggers backend cleanup.

### 4.12 Page: Admin Tournaments
- Purpose:
  - Manage tournament list (currently local storage CRUD).
- Layout:
  - Form card + list card in split layout.
- Components:
  - Inputs and remove controls.
- Interactions:
  - Add/remove tournaments persisted to local storage key.

### 4.13 Page: Admin Customers
- Purpose:
  - View customer lifetime behavior from booking data.
- Layout:
  - Single list card with aggregated rows.
- Components:
  - Customer row cards.
- Interactions:
  - Aggregation by phone computes spend, booking count, last visit.

### 4.14 Page: Admin AI Insights
- Purpose:
  - Generate strategic operational insights from booking summary.
- Layout:
  - Action button for report generation.
  - Report output area.
  - Follow-up question input + answer panel.
- Components:
  - Gemini-backed actions and text display cards.
- Interactions:
  - Prompt synthesis from booking summary data.
  - Separate report and follow-up model calls.

### 4.15 Shared Navigation, Motion, and Responsiveness
- Navigation behavior:
  - Fixed top public header.
  - Mobile hamburger in public header.
  - Admin desktop sidebar + mobile sheet menu.
- Motion behavior:
  - Fade/slide utility animations, hover-lift cards, pulse effects for CTA emphasis.
- Responsive strategy:
  - Container constraints with breakpoints.
  - Horizontal rails on mobile for product previews.
  - Grid expansion from 2-column mobile toward 3/4-column desktop.

## 5. Component Architecture

High-level tree:
- main.tsx
  - BrowserRouter
    - QueryClientProvider
      - BookingProvider
        - CartProvider
          - AdminProvider
            - TooltipProvider
              - App routes

Route hierarchy:
- Public routes
  - Layout
    - Header
    - Page Content
    - Footer
    - ChatWidget
- Admin routes
  - AdminGuard
    - AdminLayout
      - AdminSidebar / AdminMobileMenu
      - Admin page body

Reusable component groups:
- Home sections: independent, composable landing blocks.
- AI assistants: reusable feature cards/widgets integrated where relevant.
- UI primitives: standardized interaction building blocks (forms, cards, overlays, menus).

Props/state patterns:
- Stateless presentational components receive explicit props.
- Stateful page components orchestrate data fetching/filtering/mutations.
- Context hooks expose domain operations (booking/cart/admin).

Shared logic highlights:
- Local storage persistence encapsulated in useLocalStorage.
- API request wrapper centralizes error conversion and auth header insertion.
- Utility class combiner via cn helper.

## 6. Navigation & User Flow

Public top-level flow:
1. User lands on Home.
2. Chooses one intent: book slot, shop, tournaments, gallery, leaderboard.
3. Final conversion for booking/order is completed through WhatsApp deep links.

Admin flow:
1. User visits /admin/login.
2. Login success stores token and redirects to admin target page.
3. AdminGuard verifies access on protected routes.
4. Admin performs operations (bookings/slots/products/etc.).

Primary conversion flows:
- Booking flow: /booking -> select console/date/time -> summary -> WhatsApp confirmation.
- Shop flow: /shop -> filter/search/AI -> add cart -> CartDrawer -> WhatsApp order.

## 7. Backend Architecture

Server composition:
- Express app with middleware stack:
  - cors (localhost:5173 and :8080)
  - express.json
- Route modules mounted under /api namespace.
- Mongoose connection gate starts server only after successful DB connect.
- Health endpoint for readiness checks.

Middleware:
- authMiddleware:
  - Extracts bearer token.
  - Verifies JWT.
  - Attaches adminId for downstream handlers.

Service adapter:
- Cloudinary utility isolates upload/delete behavior and config checks.

Error strategy:
- Route-level try/catch with meaningful HTTP statuses.
- Domain-specific responses for common failure modes:
  - 401 invalid credentials/token
  - 403 registration restrictions
  - 404 missing resources
  - 409 booking slot conflict

## 8. API Endpoints

Base path: /api

Health:
- GET /health: service health and timestamp.

Admin Auth:
- POST /admin/login: validate credentials, return JWT + admin payload.
- GET /admin/me: token validation and current admin profile.
- POST /admin/register: create first admin (subsequent blocked by policy).

Products:
- GET /products: in-stock product list.
- GET /products/:id: product detail.
- POST /products/upload-image: admin-only image upload to Cloudinary.
- POST /products: admin-only product create.
- PUT /products/:id: admin-only product update (old Cloudinary image cleanup when changed).
- DELETE /products/:id: admin-only delete with Cloudinary cleanup.

Bookings:
- GET /bookings: admin-only listing with optional date/console filters.
- GET /bookings/availability: public availability query by date + console.
- POST /bookings: public booking create.
- PUT /bookings/:id: admin-only update.
- DELETE /bookings/:id: admin-only delete.

Tournaments:
- GET /tournaments: public list.
- POST /tournaments: admin-only create.
- PUT /tournaments/:id: admin-only update.
- DELETE /tournaments/:id: admin-only delete.

Leaderboard:
- GET /leaderboard: public top 20 ranked list.
- POST /leaderboard: admin-only create.
- PUT /leaderboard/:id: admin-only update.
- DELETE /leaderboard/:id: admin-only delete.

Slots:
- GET /slots/overrides: public blocked-slot retrieval by date (+ optional console).
- POST /slots/overrides: admin-only block creation.
- DELETE /slots/overrides/:id: admin-only unblock.

## 9. Database Design

Database: MongoDB (Mongoose schemas)

Collections and key fields:
- Admin
  - username (unique), password (bcrypt hash), role (admin/superadmin).
- Product
  - name, price, image URL, imagePublicId, category, description, inStock.
- Booking
  - customerName/customerPhone, consoleId/consoleName, date/startTime/endTime, price, status.
  - Unique compound index: consoleId + date + startTime.
- Tournament
  - name, game, schedule, entryFee, prizePool, maxSlots/filledSlots, status, icon, gradient.
- LeaderboardEntry
  - player identity and metrics: hours, game, score, wins, streak, avatar.
- SlotOverride
  - consoleId, date, startTime optional, blocked flag.

Relationships:
- Mostly denormalized document model; references are logical (string ids/names) instead of foreign-key relations.
- Booking references console metadata by duplicated string fields rather than a separate Console collection.

## 10. Data Flow

### 10.1 Feature Flow: Product Create with Cloudinary
1. Admin opens Admin Products page.
2. Frontend selects file and sends multipart request to POST /api/products/upload-image with auth header.
3. Backend multer stores buffer in memory and validates image mime.
4. Cloudinary upload stream returns secure URL + publicId.
5. Frontend submits product payload to POST /api/products with returned image metadata.
6. Backend creates Product document.
7. Frontend prepends created product to UI list.
8. On later image replacement, PUT /products/:id triggers old image deletion using previous publicId.

### 10.2 Feature Flow: Slot Booking and Availability
1. Customer opens Booking page and chooses console/date.
2. Frontend computes availability from BookingContext (and optionally API model in backend architecture).
3. Every 30 seconds, availability refresh runs.
4. Customer selects slot and confirms via WhatsApp message generation.
5. In backend-backed flow, POST /bookings creates booking document.
6. Booking unique index prevents duplicate slot writes.
7. Admin updates status via PUT /bookings/:id.
8. Availability view excludes cancelled bookings and blocked overrides.

### 10.3 Feature Flow: Admin Authentication
1. Admin submits username/password at /admin/login.
2. Frontend calls POST /api/admin/login.
3. Backend validates credentials using comparePassword.
4. JWT returned and stored in local storage key vmos-admin-token.
5. Protected route checks call GET /api/admin/me.
6. Invalid token clears local token and redirects to login.

## 11. Key Features Explained

Booking system:
- Hourly slot model (10:00 to 22:00) with availability states.
- Admin can force block/unblock slots independent of bookings.
- Clear status lifecycle for booking records.

Commerce system:
- Product catalog with fallback defaults for resilience.
- CartContext supports quantity mutation and persisted carts.
- WhatsApp used as low-friction checkout channel.

AI capabilities:
- Global chat assistant with business-aware prompt grounding.
- Slot suggester for low-crowd recommendations.
- Product AI search:
  - Natural-language product filtering via Groq JSON response.
  - Budget parser (supports formats like ₹50k, lakh, crore, INR forms).
  - Two planning modes: premium maximize-under-budget and budget-friendly near-budget with upsell path.
- Admin insights via Gemini for operational recommendations.

Admin operations:
- Dashboard metrics and recent activity snapshot.
- Booking moderation and lifecycle actions.
- Slot inventory control.
- Product/image management with cloud cleanup hygiene.

Design language:
- Consistent dark gaming identity via CSS tokens and gradients.
- Reusable elevated surfaces and motion utilities.
- Mobile-first controls with deliberate touch target sizing.

## 12. Setup Instructions

Prerequisites:
- Node.js 18+
- MongoDB (local or Atlas)
- Cloudinary account (for product image upload)
- Optional: Groq/Gemini API keys for AI features

Environment variables (.env):
- MONGODB_URI
- JWT_SECRET
- PORT (optional, default 3001)
- CLOUDINARY_CLOUD_NAME
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET
- CLOUDINARY_FOLDER (optional, default vmos/products)
- VITE_GROQ_API_KEY (frontend)
- VITE_GEMINI_API_KEY (frontend)

Install:
- npm install

Optional seed:
- npm run seed
- Creates sample products/tournaments/leaderboard and default admin if none exists.
- Default admin credentials from seed: admin / vmos2026

Run in development:
1. Start backend: npm run server
2. Start frontend: npm run dev
3. Open frontend at http://localhost:8080

Validation and quality commands:
- npm run build
- npm run lint
- npm run test

## 13. Observations & Improvements

Design and architecture patterns identified:
- Modular route-per-domain backend.
- Context-based client state containers.
- Component composition with shadcn primitive layering.
- Adapter utilities for external services (Cloudinary, AI APIs).

Strengths:
- Fast user-facing UX and clear visual identity.
- Good separation of route modules and models on backend.
- Practical cloud image lifecycle handling.
- Flexible AI integrations with meaningful product value.

Current technical debt / risks:
- Mixed source of truth for some domains:
  - Booking and some admin pages use localStorage context while backend endpoints exist.
- AI calls occur directly from browser for some features (API keys exposed to client runtime context).
- Validation is light on server-side payload schemas.
- Tournament/admin customer modules still partly local-state driven while backend alternatives exist.
- Test coverage is minimal (single smoke test).

Recommended roadmap:
1. Consolidate data source strategy: migrate all operational pages to backend APIs and use React Query for cache/invalidation.
2. Move AI invocation server-side to protect keys and enforce rate limits.
3. Add schema validation (zod/joi) on all write endpoints.
4. Add role-aware admin registration flow and stricter security controls (rate limiting, audit logs).
5. Introduce API versioning and OpenAPI docs for contract stability.
6. Expand test suite:
   - Unit tests for budget parser/planner logic.
   - Integration tests for auth and products image lifecycle.
   - E2E tests for booking and checkout journeys.
7. Introduce observability (structured logging + error tracking).

Assumptions documented:
- WhatsApp is an intentional business-operational channel, not a temporary placeholder.
- Current deployment target remains single-region, moderate traffic, and monolithic runtime.
- Dark theme is product brand requirement; no active light-mode path in current styling strategy.
