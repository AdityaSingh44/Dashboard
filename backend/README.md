# Assignment Portal - Backend

This is the Node.js + Express backend for the Assignment Workflow Portal.

## Setup

1. Copy `.env.example` to `.env` and set `MONGO_URI` (the provided URI works), and `JWT_SECRET`.
2. Install dependencies:

```powershell
npm install
```

3. Start dev server:

```powershell
npm run dev
```

## Seed / Test Users

There is a `POST /api/auth/register` route for creating users (useful for seeding). Example payloads:

Teacher:

```json
{ "name": "Alice Teacher", "email": "teacher@example.com", "password": "password", "role": "teacher" }
```

Student:

```json
{ "name": "Bob Student", "email": "student@example.com", "password": "password", "role": "student" }
```

## Important Endpoints

- `POST /api/auth/login` -> { token, role, name }
- `GET /api/assignments` -> list assignments (students only see Published)
- `POST /api/assignments` -> create (teacher only)
- `PUT /api/assignments/:id` -> edit (Draft only)
- `DELETE /api/assignments/:id` -> delete (Draft only)
- `PUT /api/assignments/:id/status` -> update status
- `POST /api/submissions` -> student submit
- `GET /api/submissions/:assignmentId` -> teacher view submissions

Protect routes by sending `Authorization: Bearer <token>` header.
