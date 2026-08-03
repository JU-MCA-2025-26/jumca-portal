# #JUMCA — Department Portal

> **amra kara?** huhh hahh, huhh hahh.

The official web portal for the JU MCA, Department of Computer Science & Engineering - your notes, placements, and journey, all in one place.

---

## Monorepo structure

```
jumca-portal/
├── apps/
│   ├── client/          # React 19 + TypeScript + Tailwind v4 (Vite)
│   └── server/          # Node.js + Express 5 + TypeScript + Prisma
├── packages/
│   └── shared/          # Shared types, validators, constants (@jumca/shared)
├── docs/
│   ├── database.dbml    # DB schema diagram source
│   ├── endpoints.md     # API endpoint documentation (add to this as you build)
│   └── pages.md         # Frontend page documentation (add to this as you build)
├── tsconfig.base.json   # Shared TS config extended by each workspace
└── package.json         # Root workspace: npm workspaces
```

## Path aliases

| Alias       | Resolves to             |
| ----------- | ----------------------- |
| `@shared/*` | `packages/shared/src/*` |
| `@client/*` | `apps/client/src/*`     |
| `@server/*` | `apps/server/src/*`     |

## Quick start

### Manually

```bash
# 1. Install all dependencies (run from repo root)
npm install

# 2. Copy env templates and fill in values
cp apps/server/.env.example apps/server/.env
cp apps/client/.env.example apps/client/.env.local

# 3. Generate Prisma client and run migrations
npm run server:prisma:migrate    # creates tables
npm run server:prisma:generate   # generates Prisma client
npm run server:prisma:seed       # seeds admin user

# 4. Start both dev servers from repo root
npm run dev                     # client → :5173  |  server → :5000

# Or start individually:
npm run server:dev              # frontend only
npm run client:dev              # backend only
```

### Using Docker

```bash
# Build and start containers (run from repo root)
docker compose up --build -d

# After running this, you can very easily api test using postman or ui test on the browser. The server will be available at http://localhost:5000 and the client at http://localhost:5173

# View running containers
docker compose ps

# Stop and remove containers
docker compose down -v

# View logs
docker compose logs -f

# Run commands inside the server container
docker compose exec server bash

# Run commands inside the client container
docker compose exec client bash

# Run commands inside the database container
docker compose exec db bash

```

## Database commands (run from apps/server)

```bash
npm run server:prisma:generate   # regenerate Prisma client after schema changes
npm run server:prisma:migrate    # create and apply a new migration
npm run server:prisma:seed       # seed initial data (admin user)
npm run server:prisma:studio     # open Prisma Studio in browser
```

## Default admin credentials (seeded)

| Field        | Value                              |
| ------------ | ---------------------------------- |
| Email / Roll | `admin@jumca.com` / `002510503000` |
| Password     | `admin123`                         |

> Change the password immediately after first login in production.

## Contributing

See the Developer Guide (in your project docs) for:

- Commit conventions
- Branch strategy
- Adding new API endpoints
- Adding new frontend pages

---
