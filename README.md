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

## Technologies

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
- jsonwebtoken (JWT)

---

## Architectural Concepts

This project applies several software engineering concepts:

### Clean Architecture

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

### SOLID Principles

#### Single Responsibility Principle (SRP)

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

### Dependency Injection (DI)

Repositories are injected into use cases, allowing easy replacement between:

- PostgreSQL
- MongoDB
- Fake repositories
- Future ORM implementations

---

## Interactive Documentation

The API provides an interactive documentation page powered by **Scalar** (a modern alternative to Swagger UI):

```
http://localhost:8000/docs
```

The OpenAPI 3.0 specification is located at [`src/docs/openapi.js`](src/docs/openapi.js), covering all endpoints, request/response schemas, and error codes.

---

## Features

### Authentication (JWT + Refresh Token)

- Login with email/password → access token (JWT, 15min) + refresh token (7 days)
- Refresh token rotation — each refresh invalidates the previous token
- Replay attack protection — reused revoked tokens invalidate all user sessions
- Logout — revokes the refresh token
- Rate limiting on login (5 attempts/15min), refresh (10/15min), and signup (3/IP/hour)

### Users

- Create user
- Get all users (admin only)
- Get user by ID (own data or admin)
- Get user by email (admin only)
- Get deleted users (admin only)
- Update user (own data)
- Soft delete user (own data)
- Hard delete user — permanent (admin only)
- Restore user (admin only)
- Get user balance

### Transactions

- Create transaction (userId from JWT token)
- List transactions by authenticated user
- Get all deleted transactions (admin only)
- Get deleted transactions by user (admin only)
- Update transaction (ownership verified)
- Soft delete transaction (ownership verified)
- Hard delete transaction — permanent (ownership + admin bypass)
- Restore transaction (ownership + admin bypass)
- User ownership validation in use-cases
- Financial amount validation

---

## Project Structure

```txt
src/
├── controllers/
│   ├── auth/
│   ├── users/
│   └── transactions/
│
├── use-cases/
│   ├── auth/
│   ├── users/
│   └── transactions/
│
├── repositories/
│   └── postgres/
│
├── factories/
│   ├── auth/
│   ├── users/
│   ├── transactions/
│   └── repositories/
│
├── middlewares/
│   ├── auth.js              ← JWT authentication
│   ├── admin.js             ← RBAC (role check)
│   ├── cors.js
│   ├── error-handler.js
│   ├── helmet.js
│   └── rate-limiter.js
│
├── helpers/
├── errors/
├── schemas/
│   ├── auth/
│   ├── user/
│   └── transaction/
│
├── routes/
└── docs/
```

---

## Installation

### Clone repository

```bash
git clone https://github.com/paulodauzackerdev/finance-app-api.git
```

---

### Install dependencies

```bash
npm install
```

---

## Environment Variables

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

# JWT
JWT_SECRET=<your-secret-min-32-chars>
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN_MS=604800000

# Optional: Protects admin user from deletion
# ADMIN_USER_ID=<uuid>

# Optional: Rate limit max requests per minute (default: 100)
# RATE_LIMIT_MAX=100
```

---

## Running the project

### Development mode

```bash
npm run start:dev
```

### Docker (development)

```bash
docker compose up -d
```

### Docker (production)

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

---

## Database

### Migrations

```bash
npm run prisma:migrate
```

### Seed

```bash
npm run seed
```

To undo seed:

```bash
npm run seed:undo
```

> In Docker, seed runs automatically in development and staging environments.

---

## API Endpoints

### Authentication

#### Login

```http
POST /api/auth/login
```

Body:

```json
{
  "email": "admin@localhost.com",
  "password": "Admin@123"
}
```

Response (200):

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "a1b2c3d4e5f6...",
  "user": {
    "id": "uuid",
    "firstName": "Admin",
    "lastName": "User",
    "email": "admin@localhost.com",
    "role": "admin"
  }
}
```

Rate limit: **5 attempts per 15 minutes** per IP.

#### Refresh Token

```http
POST /api/auth/refresh
```

Body:

```json
{
  "refreshToken": "a1b2c3d4e5f6..."
}
```

Response (200):

```json
{
  "accessToken": "eyJ...novo",
  "refreshToken": "novo-refresh-token..."
}
```

> The previous refresh token is revoked (rotation). If a revoked token is reused, **all tokens for that user are invalidated** (replay attack protection).

Rate limit: **10 attempts per 15 minutes** per IP.

#### Logout

```http
POST /api/auth/logout
Authorization: Bearer <accessToken>
```

Body:

```json
{
  "refreshToken": "a1b2c3d4e5f6..."
}
```

Response (200):

```json
{
  "message": "Logged out successfully"
}
```

---

### Users

#### Create user

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

Rate limit: **3 accounts per IP per hour**.

---

#### Get all users

```http
GET /api/users
Authorization: Bearer <accessToken>
```

Requires `admin` role. Returns all active (non-deleted) users.

---

#### Get user by ID

```http
GET /api/users/:id
Authorization: Bearer <accessToken>
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | UUID | User ID |

Users can only access their own data. Admin can access any user.

---

#### Get user by email

```http
GET /api/users/email/:email
Authorization: Bearer <accessToken>
```

Requires `admin` role.

| Parameter | Type | Description |
|-----------|------|-------------|
| `email` | string | User email |

---

#### Get deleted users

```http
GET /api/users/deleted
Authorization: Bearer <accessToken>
```

Requires `admin` role. Returns all soft-deleted users (with `deletedAt` set).

---

#### Get user balance

```http
GET /api/users/:id/balance
Authorization: Bearer <accessToken>
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

#### Update user

```http
PATCH /api/users/:id
Authorization: Bearer <accessToken>
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

Users can only update their own data.

---

#### Soft delete user

```http
DELETE /api/users/:id
Authorization: Bearer <accessToken>
```

Marks the user as deleted (sets `deletedAt` timestamp). The user will no longer appear in listings.

> **Note:** Users with ID matching `ADMIN_USER_ID` env var cannot be deleted (returns 403 Forbidden).

---

#### Hard delete user (permanent)

```http
DELETE /api/users/:id/hard
Authorization: Bearer <accessToken>
```

Requires `admin` role. Permanently removes the user from the database. Cannot be undone.

> **Note:** Users with ID matching `ADMIN_USER_ID` env var cannot be hard-deleted (returns 403 Forbidden).

---

#### Restore user

```http
PATCH /api/users/:id/restore
Authorization: Bearer <accessToken>
```

Requires `admin` role. Restores a soft-deleted user (clears `deletedAt` and reactivates).

---

### Transactions

#### Create transaction

```http
POST /api/transactions
Authorization: Bearer <accessToken>
```

Body:

```json
{
  "name": "Salary",
  "amount": 3500.5,
  "description": "Monthly salary",
  "type": "income",
  "transactionDate": "2026-05-27T15:30:00.000Z"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | ✅ | Max 100 characters |
| `amount` | number | ✅ | Positive, max 2 decimal places |
| `description` | string | ❌ | Max 500 characters |
| `type` | enum | ✅ | `income`, `expense`, or `investment` |
| `transactionDate` | ISO datetime | ❌ | Defaults to current date |

> **Note:** `userId` is automatically extracted from the JWT token. Any `userId` sent in the body is ignored.

---

#### List transactions

```http
GET /api/transactions
Authorization: Bearer <accessToken>
```

Returns all transactions belonging to the authenticated user.

> **Note:** Uses `userId` from the JWT token. The `userId` query parameter is ignored.

---

#### Get all deleted transactions

```http
GET /api/transactions/deleted
Authorization: Bearer <accessToken>
```

Requires `admin` role. Returns all soft-deleted transactions across all users.

---

#### Get deleted transactions by user

```http
GET /api/transactions/deleted/:userId
Authorization: Bearer <accessToken>
```

Requires `admin` role.

| Parameter | Type | Description |
|-----------|------|-------------|
| `userId` | UUID | User ID |

Returns soft-deleted transactions for a specific user.

---

#### Update transaction

```http
PATCH /api/transactions/:id
Authorization: Bearer <accessToken>
```

Body (at least one field required):

```json
{
  "name": "Updated name",
  "amount": 2500.0,
  "type": "expense"
}
```

Ownership is verified: users can only update their own transactions.

---

#### Soft delete transaction

```http
DELETE /api/transactions/:id
Authorization: Bearer <accessToken>
```

Marks the transaction as deleted (sets `deletedAt`). Ownership is verified.

---

#### Hard delete transaction (permanent)

```http
DELETE /api/transactions/:id/hard
Authorization: Bearer <accessToken>
```

Requires `admin` role. Permanently removes the transaction from the database.

---

#### Restore transaction

```http
PATCH /api/transactions/:id/restore
Authorization: Bearer <accessToken>
```

Requires `admin` role. Restores a soft-deleted transaction (clears `deletedAt`).

---

### Access Level Summary

```
# Public (no token)
POST   /api/auth/login                  → loginLimiter (5/15min)
POST   /api/auth/refresh                → refreshLimiter (10/15min)
POST   /api/users                       → createUserLimiter (3/IP/hora)
GET    /docs

# Authenticated (any role)
POST   /api/auth/logout
GET    /api/users/:id
GET    /api/users/:id/balance
PATCH  /api/users/:id
DELETE /api/users/:id
POST   /api/transactions
GET    /api/transactions
PATCH  /api/transactions/:id
DELETE /api/transactions/:id

# Admin only
GET    /api/users
GET    /api/users/deleted
GET    /api/users/email/:email
DELETE /api/users/:id/hard
PATCH  /api/users/:id/restore
GET    /api/transactions/deleted
GET    /api/transactions/deleted/:userId
DELETE /api/transactions/:id/hard
PATCH  /api/transactions/:id/restore
```

---

## Security

### Helmet

Adds HTTP security headers (`X-Content-Type-Options`, `X-Frame-Options`, `Content-Security-Policy`, etc.) to protect against common web vulnerabilities.

### CORS

Configured to allow requests only from allowed origins (default: `http://localhost:5173`).

### Rate Limiting

| Limiter | Window | Max Requests | Applied To |
|---------|:------:|:------------:|------------|
| Global | 1 min | 100 | All routes |
| Login | 15 min | 5 | `POST /api/auth/login` |
| Refresh | 15 min | 10 | `POST /api/auth/refresh` |
| Create user | 1 hour | 3 | `POST /api/users` |

### JWT Authentication

- **Access Token**: JWT with 15min expiration, contains `userId` and `role`
- **Refresh Token**: Random 80-char string, stored as SHA-256 hash in PostgreSQL, 7-day expiration
- **Rotation**: Each refresh invalidates the previous token
- **Replay Protection**: Reusing a revoked token invalidates all user tokens

### RBAC (Role-Based Access Control)

| Role | What they can do |
|------|------------------|
| `user` | CRUD own data and transactions |
| `admin` | Everything `user` can + list all users, hard delete, restore |

### Ownership

Ownership is enforced at the **use-case** level:
- Transaction routes verify `userId` matches the JWT token
- Admin can bypass ownership checks via `userRole === 'admin'`

---

## Error Handling

The API uses centralized error handling middleware with custom error classes:

| Error | HTTP Status | Description |
|-------|:-----------:|-------------|
| `ZodError` | 400 | Validation failed |
| `InvalidCredentialsError` | 401 | Invalid email or password |
| `InvalidRefreshTokenError` | 401 | Invalid or expired refresh token |
| `ForbiddenUserDeletionError` | 403 | Cannot delete admin user |
| `ForbiddenUserAccessError` | 403 | Cannot access another user's data |
| `TransactionUnauthorizedError` | 403 | Cannot access another user's transaction |
| `UserDeletedError` | 403 | Account is deactivated and can be restored |
| `UserNotFoundError` | 404 | User not found |
| `TransactionNotFoundError` | 404 | Transaction not found |
| `UserAlreadyExistsError` | 409 | Email already in use |
| Rate limit | 429 | Too many requests |

---

## Financial Amount Validation

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

## Future Improvements

- Pagination & Filters
- Dashboard endpoints
- CI/CD pipeline (GitHub Actions)
- Transaction categories
- Password reset flow

---

## Author

Paulo Dauzacker

GitHub:
https://github.com/paulodauzackerdev

---

## License

This project is licensed under the MIT License.
