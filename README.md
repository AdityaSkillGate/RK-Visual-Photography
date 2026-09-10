# RK Visual Photography

> **Luxury Editorial Photography Studio Website**  
> Tamil Nadu, India • Fine Art & Cinematic Storytelling

---

## 1. Overview & Brand Direction

**RK Visual Photography** is designed as a high-end, luxury editorial photography portfolio and client management platform. The aesthetic is built around:

- **Primary Background**: Deep Charcoal (`#0B0C0E`, `#111215`)
- **Typography**: Warm Ivory (`#F7F5F0`) paired with high-editorial serif (`Cormorant Garamond`) and modern sans-serif (`Plus Jakarta Sans`)
- **Signature Accent**: Antique Gold (`#C5A880`, `#D4AF37`) inspired by the authentic RK mark
- **Borders & Dividers**: Subtle bronze / dark charcoal (`#232428`)

---

## 2. Tech Stack

- **Framework**: Next.js 15 (App Router with React Server Components)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS + Custom Design System Tokens
- **Database & Auth**: Supabase PostgreSQL + Supabase Auth
- **Media Delivery**: ImageKit.io CDN & Realtime Transformations
- **Icons**: Lucide React
- **Animation Stack** *(Phases 7+)*: GSAP + ScrollTrigger, Framer Motion, Lenis Smooth Scroll
- **Deployment**: Vercel

---

## 3. Getting Started

### Prerequisites
- Node.js `v18.18+` or `v20+` / `v22+`
- npm `v9+` or `v10+`

### Installation

1. Clone or open the repository:
   ```bash
   cd RK-Photo
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Copy `.env.example` to `.env.local` and set your credentials:
   ```bash
   cp .env.example .env.local
   ```

4. Run the local development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 4. Environment Variables

| Variable | Scope | Description |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SITE_URL` | Client & Server | The public domain of the application (e.g. `http://localhost:3000`) |
| `NEXT_PUBLIC_SUPABASE_URL` | Client & Server | Your Supabase project URL (`https://xyz.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client & Server | Supabase anonymous / public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server Only | Supabase administrative service role secret key |
| `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT`| Client & Server | ImageKit URL endpoint (`https://ik.imagekit.io/your_id`) |
| `NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY` | Client & Server | ImageKit public key for transformations |
| `IMAGEKIT_PRIVATE_KEY` | Server Only | ImageKit private key for authenticated uploads |

---

## 5. Project Structure

```
RK-Photo/
├── app/
│   ├── (website)/            # Public website routes
│   │   ├── layout.tsx        # Reusable public layout (Navbar + Footer)
│   │   └── page.tsx          # Foundational brand splash
│   ├── admin/                # Admin CMS dashboard (Phase 4)
│   ├── api/                  # Backend API routes & Webhooks
│   ├── globals.css           # Tailwind directives & luxury design variables
│   ├── layout.tsx            # Root HTML layout with Google Fonts & metadata
│   ├── loading.tsx           # Luxury editorial loading state
│   ├── not-found.tsx         # Custom 404 page
│   └── error.tsx             # Client error boundary
├── components/
│   ├── ui/                   # Reusable UI primitives (buttons, modals)
│   ├── navigation/           # Floating Navbar, Editorial Footer
│   ├── animations/           # GSAP & Framer Motion wrappers
│   ├── gallery/              # Lightbox, masonry grids
│   ├── hero/                 # Hero section & RK mask animation
│   └── admin/                # CMS admin panels & controls
├── lib/
│   ├── supabase/             # Supabase clients & auth configuration
│   ├── imagekit/             # ImageKit URL transformation helpers
│   ├── seo/                  # Metadata generators & structured data
│   └── utils.ts              # ClassName merging utilities (cn)
├── hooks/                    # Reusable React hooks
├── types/                    # Core TypeScript schemas & database models
├── public/
│   └── assets/
│       └── logo/logo.png     # Official RK brand logo
├── styles/                   # Additional custom style sheets
└── plan-V1.md                # Master project architecture & phase roadmap
```

---

## 6. Available Scripts

- `npm run dev`: Starts the Next.js development server
- `npm run build`: Compiles the application for production
- `npm run start`: Runs the built production server
- `npm run lint`: Runs ESLint for code quality checks
- `npm run typecheck`: Runs the TypeScript compiler to verify all types

---

## 7. Development Roadmap

Following [`plan-V1.md`](./plan-V1.md):
- [x] **Phase 0 & 1**: Project Foundation, Luxury Design Tokens, Reusable Layouts, Asset Integration
- [ ] **Phase 2**: Supabase Database Schema, Policies & Authentication
- [ ] **Phase 3**: ImageKit Optimization & Media Upload Pipelines
- [ ] **Phase 4**: Admin CMS Dashboard & Role Controls
- [ ] **Phase 5**: Portfolio & Project Galleries Management
- [ ] **Phase 6**: Public Website Pages (Work, Stories, Services, About, Contact)
- [ ] **Phase 7**: Signature RK Mask Hero & Cinematic GSAP / Lenis Scroll
- [ ] **Phase 8**: Social Media Hub & Featured Feeds
- [ ] **Phase 9**: Interactive FAQ & Lead Assistant Chatbot
- [ ] **Phase 10**: Client Inquiries, Lead Pipeline & WhatsApp Integration
- [ ] **Phase 11**: Local SEO (Tamil Nadu), Structured JSON-LD & Performance
- [ ] **Phase 12**: QA, Security Auditing & Accessibility
- [ ] **Phase 13**: Production Deployment on Vercel
