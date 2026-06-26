# peerproducts

> A type-safe product recommendation social network built with Next.js 16, React 19, Prisma, Neon PostgreSQL, Docker, Nginx, and GitHub Actions.

**Live Platform:** [https://peer.idea-rader.com](https://peer.idea-rader.com)

---

### What Was Done

#### 1. Separated Server & Database Setup
- Migrated the database from a local container to **Neon Serverless PostgreSQL**.
  *(Moved the database to the cloud to free up EC2 memory and let it scale automatically).*
- Set up secure TLS database connections.
  *(Encrypted all data moving between the website and PostgreSQL to keep it safe).*

#### 2. Containerization & Orchestration
- Containerized the application using a multi-stage `node:20-alpine` **Dockerfile**.
  *(Ensures the app runs identically on local dev and the AWS server. Added `libc6-compat` and `ca-certificates` so Prisma and database connections work on Alpine).*
- Configured **Docker Compose** for environment orchestration.
  *(Binds all environment secrets—like Google OAuth and Cloudinary keys—and automatically runs Prisma migrations when the container starts).*

#### 3. Ingress Reverse Proxy & SSL Setup
- Set up **Nginx** as a reverse proxy to forward traffic to port 3000.
  *(Nginx handles public ingress and routes traffic safely to the Docker container).*
- Passed proxy headers (`Host`, `X-Forwarded-Proto`, `X-Forwarded-For`) to Next.js.
  *(Tells NextAuth the client's real protocol and domain, fixing `UntrustedHost` and OAuth protocol redirect mismatches).*
- Secured the domain `peer.idea-rader.com` using **Certbot**.
  *(Handles HTTPS SSL certificate generation and auto-renewal via Let's Encrypt).*

#### 4. Database Drift & Migration Safeguards
- Cleared the Prisma database migration lock (`P3009`).
  *(Wrote a script to delete failed migration logs from `_prisma_migrations` so database updates could run again).*
- Made the database schema migrations idempotent.
  *(Used SQL guards like `ALTER TABLE IF EXISTS` and `DROP TABLE IF EXISTS` so deployments can run safely multiple times without crashing or losing data).*

#### 5. Google OAuth 2.0 Identity Flow
- Configured Google OAuth callbacks with NextAuth.
  *(Allows users to sign in securely using their Google accounts).*
- Synced Nginx protocols with the Google Developer Console.
  *(Fixed callback mismatches by forcing the app to return secure redirect links).*

#### 6. Continuous Integration & Deployment (CI/CD)
- Created a **GitHub Actions** CI/CD pipeline triggered on pushing to the `main` branch.
  *(Automates building, testing, and deploying updates).*
- Configured Docker builds with layer caching (`Buildx` GHA cache) and pushed to Docker Hub.
  *(Speeds up build times by caching unchanged files and saves the final package to our registry).*
- Configured automatic deployment to the AWS EC2 instance via SSH keys.
  *(Pulls the latest container image and triggers a zero-downtime rolling container reload on the server).*

---

### How to Run Locally

To run this application on your local computer:

1. **Install dependencies:**
   ```bash
   npm ci
   ```
   *(Downloads and installs all library packages needed to run the website).*

2. **Generate Database Client & Sync Schema:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```
   *(Builds the database connection tools and sets up the required tables inside PostgreSQL).*

3. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   *(Starts a local server at http://localhost:3000 where you can see code updates in real-time).*