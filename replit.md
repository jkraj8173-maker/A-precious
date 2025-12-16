# Project Overview

A romantic web application with a beautiful, kawaii-themed interface featuring celebrations, music, and surprises.

## Tech Stack

- **Frontend**: React 18 with Vite, TailwindCSS, Radix UI components
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: TailwindCSS with custom animations

## Project Structure

```
├── client/           # React frontend
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── hooks/       # Custom React hooks
│   │   ├── lib/         # Utilities
│   │   └── pages/       # Page components
│   └── public/          # Static assets
├── server/           # Express backend
│   ├── index.ts      # Server entry point
│   ├── routes.ts     # API routes
│   ├── db.ts         # Database connection
│   └── vite.ts       # Vite dev middleware
├── shared/           # Shared code
│   └── schema.ts     # Drizzle database schema
└── attached_assets/  # Images and media
```

## Development

- **Start Dev Server**: `npm run dev` (runs on port 5000)
- **Database Push**: `npm run db:push` (push schema changes)
- **Build**: `npm run build`
- **Production**: `npm run start`

## Database Tables

- `users` - User accounts
- `proposal_responses` - Proposal response tracking
- `site_visits` - Visit tracking
- `surprise_configs` - Surprise content configuration
- `site_content` - Site content management

## Recent Changes

- December 16, 2025: Initial import and setup for Replit environment
