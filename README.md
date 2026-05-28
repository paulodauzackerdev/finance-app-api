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

---

# Technologies

- Node.js
- Express.js
- PostgreSQL
- JavaScript (ES Modules)
- Validator.js
- Bcrypt
- Dotenv

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

# Features

## Users

- Create user
- Get all users
- Get user by ID
- Get user by email
- Update user
- Delete user

---

## Transactions

- Create transaction
- Transaction validation
- User ownership validation
- Financial amount validation
- PostgreSQL persistence

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
│   ├── postgres/
│   └── fake/
│
├── factories/
│   ├── users/
│   ├── transactions/
│   └── repositories/
│
├── middlewares/
├── helpers/
├── errors/
├── routes/
└── db/
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

Create a `.env` file:

```env
PORT=8000

POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
POSTGRES_DB=finance_app
```

---

# Running the project

## Development mode

```bash
npm run start:dev
```

---

# Database Migration

Run your PostgreSQL migration script to create:

- users table
- transactions table
- indexes
- triggers
- enums

---

# API Endpoints

# Users

## Create user

```http
POST /api/users
```

Body:

```json
{
  "first_name": "Paulo",
  "last_name": "Dauzacker",
  "email": "paulo@email.com",
  "password": "123456"
}
```

---

## Get all users

```http
GET /api/users
```

---

## Get user by ID

```http
GET /api/users/:id
```

---

## Update user

```http
PATCH /api/users/:id
```

---

## Delete user

```http
DELETE /api/users/:id
```

---

# Transactions

## Create transaction

```http
POST /api/transactions
```

Body:

```json
{
  "user_id": "USER_UUID",
  "name": "Salary",
  "amount": 3500.5,
  "description": "Monthly salary",
  "type": "income",
  "transaction_date": "2026-05-27T15:30:00.000Z"
}
```

---

# Error Handling

The API uses centralized error handling middleware.

Examples:

- Invalid email
- Invalid UUID
- Weak password
- Transaction validation errors
- Unauthorized access
- Resource not found

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
- Refresh Tokens
- Docker
- Automated Tests
- Pagination
- Filters
- Dashboard endpoints
- CI/CD
- Swagger Documentation

---

# Author

Paulo Dauzacker

GitHub:
https://github.com/paulodauzackerdev

---

# License

This project is licensed under the MIT License.
