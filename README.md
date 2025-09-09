
# 🧙‍♂️ FantaMD

FantaMD is a full-stack web application designed to support participants management for our fantasy football game. It combines a **Fastify + PostgreSQL** backend with a **Next.js + Tailwind CSS + Hero UI** frontend. The entire project is deployed on **[Vercel](https://vercel.com/)** for seamless hosting and scalability.

---

## 📦 Backend – `fantamd-be`

### 🛠 Tech Stack

- **Fastify**: High-performance Node.js framework
- **PostgreSQL**: Relational database
- **Knex.js**: SQL query builder
- **TypeScript**: Type-safe development
- **Fastify Plugins**:
  - Authentication: `@fastify/jwt`, `@fastify/auth`
  - Database: `@fastify/postgres`
  - Documentation: `@fastify/swagger`, `@fastify/swagger-ui`
  - Utilities: `@fastify/env`, `@fastify/sensible`, `@fastify/rate-limit`, `@fastify/cors`

### 🚀 Deployment

The backend is deployed as a **Serverless Function** on Vercel. This ensures fast cold starts and scalability.

### 🔧 Scripts

```bash
npm run build       # Compile TypeScript
npm start           # Start Fastify server
npm run standalone  # Run with .env file
npm test            # Run tests with watch mode - need docker installed
npm run test:run            # Run tests with coverage - need docker installed
npm run lint        # Lint code
```

---

## 🎨 Frontend – `fantamd-fe`

### 🛠 Tech Stack

- **Next.js**: React framework with SSR and SSG
- **Tailwind CSS**: Utility-first styling
- **Hero UI**: Accessible and customizable UI components
- **React Hook Form**: Form management

### 🚀 Deployment

The frontend is deployed on **Vercel** using Next.js's native support. Vercel handles:

- Automatic builds on push
- Preview deployments for branches
- Production deployment on main

### 🔧 Scripts

```bash
npm run dev     # Start development server
npm run build   # Build for production
npm start       # Start production server
npm run lint    # Lint and fix code
```

---

## 🌐 Live Deployment

Both frontend and backend are deployed on **Vercel**. You can access the live application via:

- **Frontend**: `https://fantamd-fe.vercel.app`
- **Backend API Docs**: `https://fantamd-be.vercel.app/api/docs`

---

## 🛠 Development Setup

### Backend

```bash
cd fantamd-be
cp .env.local .env
npm install
npm start
```

### Frontend

```bash
cd fantamd-fe
npm install
npm run dev
```

---

## 🐳 Docker Setup

You can run the entire FantaMD stack using Docker Compose. This includes:

- **Frontend** (`fantamd-fe`)
- **Backend** (`fantamd-be`)
- **PostgreSQL Database** (`fantamd-db`)
- **pgAdmin** (`fantamd-pgadmin`) for database management

### 🚀 How to Run

1. Make sure Docker and Docker Compose are installed.
2. From the root of the project, run:

```bash
docker-compose up --build
```

3. Access the services:
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:8080](http://localhost:8080)
   - pgAdmin: [http://localhost:9000](http://localhost:9000)

> Use `admin@example.com` / `admin` to log into pgAdmin and connect to the `fantamd` database.

---
