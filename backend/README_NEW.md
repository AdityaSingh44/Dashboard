# Assignment Portal Backend

A Node.js/Express backend for the Assignment Workflow Portal with role-based authentication and assignment management.

## Features

- **JWT Authentication**: Secure login system with role-based access (teacher/student)
- **Assignment Management**: CRUD operations with workflow states (Draft → Published → Completed)
- **Submission System**: Students can submit answers, teachers can review submissions
- **Role-based Access Control**: Different endpoints for teachers and students
- **MongoDB Integration**: Persistent data storage with Mongoose ODM

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## Quick Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Configuration:**
   Create a `.env` file in the backend directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://root:root@completecoding.qy8jdg8.mongodb.net/tailwebs?retryWrites=true&w=majority&appName=CompleteCoding
   JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random_123456789
   JWT_EXPIRE=30d
   NODE_ENV=development
   ```

3. **Seed Test Data (Optional):**
   ```bash
   node seeder.js
   ```

4. **Start the Server:**
   ```bash
   npm start
   ```

The server will run on `http://localhost:5000`

## Test Accounts

After running the seeder, you can use these test accounts:

- **Teacher**: `teacher@test.com` / `teacher123`
- **Student 1**: `alice@test.com` / `student123`
- **Student 2**: `bob@test.com` / `student123`

## API Endpoints

### Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/login` | User login | Public |
| POST | `/api/auth/register` | User registration | Public |

#### Login Request:
```json
{
  "email": "teacher@test.com",
  "password": "teacher123"
}
```

#### Login Response:
```json
{
  "token": "jwt_token_here",
  "role": "teacher",
  "name": "John Teacher"
}
```

### Assignments

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/assignments` | List assignments | Authenticated |
| POST | `/api/assignments` | Create assignment | Teacher only |
| PUT | `/api/assignments/:id` | Edit assignment | Teacher only (Draft only) |
| DELETE | `/api/assignments/:id` | Delete assignment | Teacher only (Draft only) |
| PUT | `/api/assignments/:id/status` | Change status | Teacher only |
| GET | `/api/assignments/:id/submissions` | View submissions | Teacher only |

#### Query Parameters for GET /api/assignments:
- `status` - Filter by status (Draft, Published, Completed)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)

#### Create Assignment Request:
```json
{
  "title": "JavaScript Fundamentals",
  "description": "Write a function that calculates factorial",
  "dueDate": "2024-12-31"
}
```

#### Status Change Request:
```json
{
  "status": "Published"
}
```

### Submissions

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/submissions` | Submit answer | Student only |
| GET | `/api/submissions/mine` | Get my submissions | Student only |
| GET | `/api/submissions/:assignmentId/mine` | Get my submission for assignment | Student only |
| GET | `/api/submissions/:assignmentId` | Get all submissions for assignment | Teacher only |
| PUT | `/api/submissions/:id/review` | Mark as reviewed | Teacher only |

#### Submit Answer Request:
```json
{
  "assignmentId": "assignment_id_here",
  "answer": "function factorial(n) { return n <= 1 ? 1 : n * factorial(n - 1); }"
}
```

## Database Models

### User
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['teacher', 'student'], required),
  timestamps: true
}
```

### Assignment
```javascript
{
  title: String (required),
  description: String,
  dueDate: Date,
  status: String (enum: ['Draft', 'Published', 'Completed'], default: 'Draft'),
  createdBy: ObjectId (ref: User, required),
  timestamps: true
}
```

### Submission
```javascript
{
  assignmentId: ObjectId (ref: Assignment, required),
  studentId: ObjectId (ref: User, required),
  answer: String (required),
  submittedAt: Date (default: Date.now),
  reviewed: Boolean (default: false),
  timestamps: true
}
```

## Workflow Rules

### Assignment State Transitions
- **Draft → Published**: Assignment becomes visible to students
- **Published → Completed**: No more submissions allowed, teacher has reviewed
- **Draft**: Can be edited and deleted
- **Published**: Cannot be deleted, students can submit
- **Completed**: Locked, no changes allowed

### Business Rules
- Students can only see **Published** assignments
- Students can submit only **one answer per assignment**
- Submissions not allowed after due date
- Only assignment creators can manage their assignments
- Teachers can view all submissions for their assignments

## Security Features

- **JWT Token Authentication**: Secure API access
- **Password Hashing**: bcrypt with salt rounds
- **Role-based Access Control**: Teacher/Student permissions
- **Input Validation**: Server-side validation for all inputs
- **CORS Configuration**: Controlled cross-origin access

## Development

### Project Structure
```
backend/
├── models/           # Mongoose models
│   ├── User.js
│   ├── Assignment.js
│   └── Submission.js
├── routes/           # API route handlers
│   ├── auth.js
│   ├── assignments.js
│   └── submissions.js
├── middleware/       # Custom middleware
│   └── auth.js
├── .env             # Environment variables
├── server.js        # Main server file
├── seeder.js        # Test data seeder
└── package.json
```

### Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `node seeder.js` - Populate database with test data