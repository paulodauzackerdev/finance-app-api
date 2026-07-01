# Finance App API

REST API for personal financial management built with **Node.js**, **Express**, **PostgreSQL**, and **Clean Architecture** principles.

This project was created to study and apply backend engineering concepts such as:

- Clean Architecture
- SOLID principles
- Dependency Injection (DI)
- Repository Pattern
- Error Handling
- RESTful APIs
- PostgreSQL integration
- Scalable folder organization
- Interactive API documentation

---

# Technologies

- Node.js
- Express.js
- PostgreSQL
- JavaScript (ES Modules)
- Prisma (ORM)
- Zod (validation)
- Bcrypt
- Dotenv
- Scalar (API reference)
- Helmet (security headers)
- CORS
- express-rate-limit

---

# Architectural Concepts

This project applies several software engineering concepts:

## Clean Architecture

The application is separated into layers:

```txt
controllers/
use-cases/
repositories/
factories/
middlewares/
errors/
helpers/
```

Each layer has a single responsibility.

---

## SOLID Principles

### Single Responsibility Principle (SRP)

Each class has only one responsibility.

Example:

- Controllers handle HTTP requests
- Use cases contain business logic
- Repositories handle database access

---

### Dependency Inversion Principle (DIP)

Use cases depend on abstractions instead of concrete implementations.

Repositories are injected through factories.

---

## Dependency Injection (DI)

Repositories are injected into use cases, allowing easy replacement between:

- PostgreSQL
- MongoDB
- Fake repositories
- Future ORM implementations

---

# Interactive Documentation

The API provides an interactive documentation page powered by **Scalar** (a modern alternative to Swagger UI):

```
http://localhost:8000/docs
```

The OpenAPI 3.0 specification is located at [`src/docs/openapi.js`](src/docs/openapi.js), covering all endpoints, request/response schemas, and error codes.

---

# Features

## Users

- Create user
- Get all users
- Get user by ID
- Get user by email
- Update user
- Soft delete user
- Hard delete user (permanent)
- Restore user
- Get user balance

---

## Transactions

- Create transaction
- List transactions by user
- Update transaction
- Soft delete transaction
- Hard delete transaction (permanent)
- Restore transaction
- User ownership validation
- Financial amount validation

---

# Project Structure

```txt
src/
├── controllers/
│   ├── users/
│   └── transactions/
│
├── use-cases/
│   ├── users/
│   └── transactions/
│
├── repositories/
│   └── postgres/
│
├── factories/
│   ├── users/
│   ├── transactions/
│   └── repositories/
│
├── middlewares/
│   ├── cors.js
│   ├── error-handler.js
│   ├── helmet.js
│   └── rate-limiter.js
│
├── helpers/
├── errors/
├── schemas/
│   ├── user/
│   └── transaction/
│
├── routes/
└── docs/
```

---

# Installation

## Clone repository

```bash
git clone https://github.com/paulodauzackerdev/finance-app-api.git
```

---

## Install dependencies

```bash
npm install
```

---

# Environment Variables

Copy `.env.example` to `.env` and adjust the values:

```bash
cp .env.example .env
```

```env
PORT=8000
NODE_ENV=development

POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=finance_user
POSTGRES_PASSWORD=finance_pass
POSTGRES_DB=financeapp

DATABASE_URL=postgresql://finance_user:finance_pass@localhost:5432/financeapp

# Optional: Protects admin user from deletion
# ADMIN_USER_ID=<uuid>

# Optional: Rate limit max requests per minute (default: 100)
# RATE_LIMIT_MAX=100
```

---

# Running the project

## Development mode

```bash
npm run start:dev
```

## Docker (development)

```bash
docker compose up -d
```

## Docker (production)

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

---

# Database

## Migrations

```bash
npm run prisma:migrate
```

## Seed

```bash
npm run seed
```

To undo seed:

```bash
npm run seed:undo
```

> In Docker, seed runs automatically in development and staging environments.

---

# API Endpoints

## Users

### Create user

```http
POST /api/users
```

Body:

```json
{
  "firstName": "Paulo",
  "lastName": "Dauzacker",
  "email": "paulo@email.com",
  "password": "Test@1234"
}
```

Password requirements: minimum 8 characters, at least 1 uppercase, 1 lowercase, 1 number, and 1 special character.

---

### Get all users

```http
GET /api/users
```

Returns all active (non-deleted) users.

---

### Get user by ID

```http
GET /api/users/:id
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | UUID | User ID |

---

### Get user by email

```http
GET /api/users/email/:email
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `email` | string | User email |

---

### Get user balance

```http
GET /api/users/:id/balance
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | UUID | User ID |

Response:

```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "userName": "Sarah Connor",
  "userEmail": "sarah@resistance.com",
  "balance": {
    "totalIncome": 10000.0,
    "totalExpense": 3000.0,
    "totalInvestment": 2000.0,
    "balance": 5000.0
  }
}
```

---

### Update user

```http
PATCH /api/users/:id
```

Body (at least one field required):

```json
{
  "firstName": "Paulo",
  "lastName": "Updated",
  "email": "paulo@email.com",
  "password": "NewPass@123"
}
```

---

### Soft delete user

```http
DELETE /api/users/:id
```

Marks the user as deleted (sets `deletedAt` timestamp). The user will no longer appear in listings.

> **Note:** Users with ID matching `ADMIN_USER_ID` env var cannot be deleted (returns 403 Forbidden).

---

### Hard delete user (permanent)

```http
DELETE /api/users/:id/hard
```

Permanently removes the user from the database. Cannot be undone.

> **Note:** Users with ID matching `ADMIN_USER_ID` env var cannot be hard-deleted (returns 403 Forbidden).

---

### Restore user

```http
PATCH /api/users/:id/restore
```

Restores a soft-deleted user (clears `deletedAt` and reactivates).

---

## Transactions

### Create transaction

```http
POST /api/transactions
```

Body:

```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Salary",
  "amount": 3500.5,
  "description": "Monthly salary",
  "type": "income",
  "transactionDate": "2026-05-27T15:30:00.000Z"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `userId` | UUID | ✅ | User who owns the transaction |
| `name` | string | ✅ | Max 100 characters |
| `amount` | number | ✅ | Positive, max 2 decimal places |
| `description` | string | ❌ | Max 500 characters |
| `type` | enum | ✅ | `income`, `expense`, or `investment` |
| `transactionDate` | ISO datetime | ❌ | Defaults to current date |

---

### List transactions by user

```http
GET /api/transactions?userId=USER_UUID
```

| Query | Type | Required | Description |
|-------|------|----------|-------------|
| `userId` | UUID | ✅ | Filter transactions by user |

---

### Update transaction

```http
PATCH /api/transactions/:id
```

Body (at least one field required):

```json
{
  "name": "Updated name",
  "amount": 2500.0,
  "type": "expense"
}
```

---

### Soft delete transaction

```http
DELETE /api/transactions/:id
```

Marks the transaction as deleted (sets `deletedAt`).

---

### Hard delete transaction (permanent)

```http
DELETE /api/transactions/:id/hard
```

Permanently removes the transaction from the database.

---

### Restore transaction

```http
PATCH /api/transactions/:id/restore
```

Restores a soft-deleted transaction (clears `deletedAt`).

---

# Security

## Helmet

Adds HTTP security headers (`X-Content-Type-Options`, `X-Frame-Options`, `Content-Security-Policy`, etc.) to protect against common web vulnerabilities.

## CORS

Configured to allow requests only from allowed origins (default: `http://localhost:5173`).

## Rate Limiting

Global rate limit: 100 requests per minute per IP (configurable via `RATE_LIMIT_MAX` env var).

---

# Error Handling

The API uses centralized error handling middleware with custom error classes:

| Error | HTTP Status | Description |
|-------|:-----------:|-------------|
| `UserNotFoundError` | 404 | User not found |
| `TransactionNotFoundError` | 404 | Transaction not found |
| `InvalidCredentialsError` | 401 | Invalid email or password |
| `ForbiddenUserDeletionError` | 403 | Cannot delete admin user |
| `TransactionUnauthorizedError` | 403 | Cannot access another user's transaction |
| `UserAlreadyExistsError` | 409 | Email already in use |
| `UserDeletedError` | 403 | Account is deactivated and can be restored |
| `ZodError` | 400 | Validation failed

---

# Financial Amount Validation

Transactions support:

- positive values only
- max 2 decimal places
- finite numbers only

Examples:

```js
100
99.9
3500.5
```

---

# Future Improvements

- JWT Authentication
- Refresh token support
- Pagination & Filters
- Dashboard endpoints
- CI/CD pipeline (GitHub Actions)
- Transaction categories
- Password reset flow

---

# Author

Paulo Dauzacker

GitHub:
https://github.com/paulodauzackerdev

---

# License

This project is licensed under the MIT License.
