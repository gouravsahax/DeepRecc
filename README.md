# PeerProducts 🛍️

**PeerProducts** is a modern, premium product recommendation social network where people discover and share genuine, peer-to-peer product recommendations and reviews without ads or sponsors.

---

## 🚀 Features

### 1. 🔍 Type-Based Search & Pagination
- Filter product recommendations by type (e.g., *Book*, *Sunscreen*, *Chair*) with immediate, query-preserving pagination (`/?page=1&search=term`).
- Automatic URL normalization: visiting the naked root path `/` redirects to `/?page=1`.
- Feed displays 8 items per page with Next/Previous navigation controls.

### 2. ⚡ Performance & Caching
- Configured **Next.js 16 Data Caching** using `unstable_cache` for database queries (Home feed, User recommendations, and Profiles).
- Incorporated **User Session Serialization** inside cache keys to prevent dynamic "like" states from leaking across different accounts.
- Leveraged Server Actions **`updateTag` invalidation** for instant, "read-your-own-writes" cache synchronization when adding, editing, liking, or deleting recommendations.

### 3. 🎨 Premium Landing Page & Skeletons
- A responsive, animated landing page on `/auth` for unauthenticated visitors. Features a 3D overlapping stack of product images with interactive scale-up hover micro-animations.
- Tailored loading skeleton loaders (`loading.tsx`) designed to match forms and page layouts, eliminating visual layout shifts.

### 4. 🔒 Route Protection & Auth
- **Google OAuth** integration powered by Auth.js (NextAuth).
- Middleware-level route protection (`proxy.ts`) ensuring all core functional pages (`/`, `/profile`, `/create`, `/reccs`, `/reccs/edit/*`) are accessible only by logged-in users, redirecting anonymous users to `/auth`.

### 5. 📈 SEO Optimization
- Automated page-specific metadata configuration exporting dynamic title tags and meta descriptions across all Server Component pages.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Runtime**: React 19
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Database ORM**: Prisma
- **Database**: PostgreSQL (Neon Serverless)
- **Authentication**: Auth.js (NextAuth v5 Beta)
- **Media Hosting**: Cloudinary

---

## ⚙️ Development Setup

### 1. Clone & Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory and configure the following variables:
```env
# Database Connection
DATABASE_URL="postgresql://..."

# Auth.js Config (Generate AUTH_SECRET via openssl rand -base64 33)
AUTH_SECRET="your-auth-secret"
AUTH_GOOGLE_ID="google-client-id"
AUTH_GOOGLE_SECRET="google-client-secret"

# Next Auth Base URL (optional for dev)
NEXTAUTH_URL="http://localhost:3000"

# Cloudinary Credentials
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### 3. Database Push
Sync the Prisma schema with your database instance:
```bash
npx prisma db push
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### 5. Verify Build Compilation
Validate route compiling and TypeScript checking before deployment:
```bash
npm run build
```
