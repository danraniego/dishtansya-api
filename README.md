# Dishtansya API

Backend for **Dishtansya**, a food delivery app. Provides the Registration, Login, and Order APIs.

Built with Node.js, Express 5, TypeScript, Sequelize (PostgreSQL), BullMQ (Redis), and JWT.

## Endpoints

| Method | Path        | Auth         | Success                                                         | Errors |
|--------|-------------|--------------|-----------------------------------------------------------------|--------|
| POST   | `/register` | –            | `201` `{ "message": "User successfully registered" }`           | `400` Email already taken · `422` validation |
| POST   | `/login`    | –            | `201` `{ "access_token": "<JWT>" }`                             | `401` Invalid credentials · `423` account locked · `422` validation |
| POST   | `/order`    | Bearer token | `201` `{ "message": "You have successfully ordered this product." }` | `400` insufficient stock · `401` missing/invalid token · `404` product not found · `422` validation |

### Example

```bash
curl -X POST http://localhost:8000/register -H 'Content-Type: application/json' \
  -d '{"email":"backend@multisyscorp.com","password":"test123"}'

curl -X POST http://localhost:8000/login -H 'Content-Type: application/json' \
  -d '{"email":"backend@multisyscorp.com","password":"test123"}'

curl -X POST http://localhost:8000/order -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <access_token>' \
  -d '{"product_id":"1","quantity":"2"}'
```

## Features

- **Async welcome email.** Registration pushes a job onto a BullMQ `email` queue; a separate worker process (`npm run worker:start`) sends it. If Redis is unavailable, registration still succeeds and the failure is logged.
- **Account locking.** 5 consecutive failed logins lock the account for 5 minutes (`423`). A successful login resets the counter.
- **Stock deduction.** A successful order deducts the quantity from the product's `available_stock`. The stock check and deduction are a single conditional `UPDATE` inside a transaction, so concurrent orders cannot oversell.
- **Product seeder** with `id`, `name`, and `available_stock`.

## Prerequisites

- Node.js 20+
- PostgreSQL
- Redis
- An SMTP server (the dev compose file includes Mailpit)

## Setup

1. Install dependencies
   ```bash
   npm install
   ```
2. Create `.env` from `.env.example` and fill in your values (set a strong `JWT_SECRET`).
   ```bash
   cp .env.example .env
   ```
3. Start Postgres, Redis, and Mailpit (optional, via Docker)
   ```bash
   docker compose -f docker-compose-dev.yml --env-file .env up -d
   ```
4. Run migrations and seed products
   ```bash
   npm run db:setup
   ```
5. Start the API and the queue worker (in separate terminals)
   ```bash
   npm run dev
   npm run worker:start
   ```

Sent emails can be viewed in Mailpit at http://localhost:8025.

## Tests

```bash
npm test
```

Tests cover all scenarios in the spec plus account locking, stock deduction, and edge cases. They run against an in-memory SQLite database with the email queue mocked, so no Postgres or Redis is needed.

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Run API with hot reload |
| `npm run worker:start` | Run queue workers |
| `npm run build` | Compile to `dist/` |
| `npm run migrate` / `migrate:undo` / `migrate:undo:all` | Database migrations |
| `npm run seed` / `seed:undo:all` | Database seeders |
| `npm run db:setup` | Migrate + seed |
| `npm run associations:generate` | Regenerate `src/database/associations.ts` |
| `npm test` | Run tests |

## Project Structure

```
src/
├── api/v1/
│   ├── auth/            # /register, /login  (route, controller, service, validator, dto)
│   └── order/           # /order
├── core/
│   ├── config/          # cors, rate limiter, redis
│   ├── contexts/        # authenticated user accessor
│   ├── http/            # HttpResponse helpers
│   ├── middlewares/     # auth (JWT), validation, body sanitizing
│   ├── providers/       # JWT auth, mail
│   └── utils/           # logger, password hashing, ServiceError
├── database/
│   └── maindb/          # models, migrations, seeders
├── shared/              # constants, data services
├── workers/queue/       # BullMQ queues + workers
├── __tests__/           # Jest + Supertest
├── app.ts / index.ts    # Express app / HTTP server
└── worker.ts            # Queue worker entry point
```
