# AI Video Generator

A professional full-stack platform for AI video generation, designed for scalability and deployment on Render.

## Tech Stack

**Frontend:**
- React 19 + Vite
- TypeScript
- Tailwind CSS
- Framer Motion
- React Query
- React Router v7

**Backend:**
- Node.js + Express
- TypeScript
- Axios
- FFmpeg Integration Ready
- Pino Logger
- In-Memory Queue (Replaceable with BullMQ/Redis)

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
npm start
```

## Architecture

- `src/` - React Frontend Application
- `server/` - Node.js Backend API
- `temp/` - Temporary storage for processing uploads and videos (cleared automatically based on retention policy)

## Deployment

This repository includes a `Dockerfile` and `render.yaml` for zero-configuration deployment to Render.
