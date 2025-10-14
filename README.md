# Assignment Workflow Portal

A comprehensive web application built with React.js and Node.js that provides a complete assignment management system for teachers and students. The portal features role-based authentication, workflow-driven assignment states, and a responsive user interface.

## 🚀 Features

### Core Functionality
- **Single Login System**: Unified authentication for both teachers and students
- **Role-based Access Control**: Different interfaces and permissions for teachers and students
- **Assignment Workflow**: State transitions (Draft → Published → Completed)
- **Submission Management**: Students can submit text-based answers, teachers can review
- **Real-time Filtering**: Filter assignments by status and view relevant submissions

### Teacher Features
- Create and manage assignments with title, description, and due dates
- Edit assignments (Draft status only)
- Publish assignments to make them visible to students
- Mark assignments as completed after review
- View all student submissions for each assignment
- Mark submissions as reviewed
- Delete assignments (Draft status only)

### Student Features
- View only published assignments
- Submit one answer per assignment
- View previously submitted answers
- Due date validation (no submissions after deadline)
- Track submission timestamps

## 🛠 Technology Stack

### Frontend (React.js)
- **React 18** - Modern React with hooks and context
- **React Router DOM** - Client-side routing with role-based protection
- **Context API** - Global state management for authentication
- **Custom API Client** - HTTP requests with automatic JWT token handling
- **CSS3** - Responsive design with modern styling
- **LocalStorage** - Session persistence

### Backend (Node.js)
- **Node.js & Express.js** - Server runtime and web framework
- **MongoDB & Mongoose** - NoSQL database with ODM
- **JWT (JSON Web Tokens)** - Secure authentication
- **bcryptjs** - Password hashing and security
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment configuration

### Database Schema
- **Users**: Name, email, password (hashed), role (teacher/student)
- **Assignments**: Title, description, due date, status, creator reference
- **Submissions**: Assignment reference, student reference, answer, timestamps, review status

## 📋 Requirements Fulfilled

✅ **Single Login Page with Role-Based Redirection**
- Unified login for teachers and students
- JWT token authentication
- Automatic redirection based on user role
- Clear error handling for invalid credentials

✅ **Teacher Dashboard – Assignment Management**
- Complete assignment lifecycle management
- State transitions: Draft → Published → Completed
- CRUD operations with proper restrictions
- Student submission viewing and review system

✅ **Student Dashboard – Assignment Viewing and Submission**
- View only published assignments
- One submission per assignment restriction
- View submitted answers (read-only after submission)
- Due date validation

✅ **Assignment Listing & Filtering**
- Teachers: Filter by Draft/Published/Completed status
- Students: Auto-filtered to show only Published assignments
- Pagination support for large datasets

✅ **Technology Requirements**
- React.js frontend with Context API state management
- Node.js + Express.js RESTful API backend
- Proper form validation and error handling
- Responsive design principles

✅ **Security Best Practices**
- JWT token-based authentication
- Password hashing with bcrypt
- Role-based route protection
- Input validation on both client and server
- CORS configuration for secure API access

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB database access
- Git

### 1. Clone and Setup
```bash
# Clone the repository
git clone <repository-url>
cd Dashboard

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Configuration
Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGO_URI=mongodb+srv://root:root@completecoding.qy8jdg8.mongodb.net/tailwebs?retryWrites=true&w=majority&appName=CompleteCoding
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random_123456789
JWT_EXPIRE=30d
NODE_ENV=development
```

### 3. Populate Test Data (Optional)
```bash
cd backend
node seeder.js
```

### 4. Start the Application
```bash
# Terminal 1: Start backend server
cd backend
npm start

# Terminal 2: Start frontend development server
cd frontend
npm start
```

### 5. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 👤 Test Accounts

After running the seeder, use these accounts to test the application:

| Role | Email | Password | Description |
|------|-------|----------|-------------|
| Teacher | `teacher@test.com` | `teacher123` | Full assignment management access |
| Student | `alice@test.com` | `student123` | Student with sample submissions |
| Student | `bob@test.com` | `student123` | Additional student account |

## 📚 API Documentation

### Authentication Endpoints
```http
POST /api/auth/login
POST /api/auth/register
```

### Assignment Endpoints
```http
GET    /api/assignments              # List assignments (role-filtered)
POST   /api/assignments              # Create assignment (teacher only)
PUT    /api/assignments/:id          # Edit assignment (teacher only, draft only)
DELETE /api/assignments/:id          # Delete assignment (teacher only, draft only)
PUT    /api/assignments/:id/status   # Update assignment status (teacher only)
GET    /api/assignments/:id/submissions # Get submissions (teacher only)
```

### Submission Endpoints
```http
POST /api/submissions                    # Submit answer (student only)
GET  /api/submissions/mine              # Get my submissions (student only)
GET  /api/submissions/:assignmentId/mine # Get my submission for assignment
PUT  /api/submissions/:id/review        # Mark as reviewed (teacher only)
```

## 🔄 Workflow Examples

### Teacher Workflow
1. **Login** as teacher → Redirected to Teacher Dashboard
2. **Create Assignment** → Starts in "Draft" status
3. **Edit Details** → Can modify while in Draft
4. **Publish Assignment** → Changes status to "Published" (visible to students)
5. **Review Submissions** → View student answers and mark as reviewed
6. **Complete Assignment** → Changes status to "Completed" (locked)

### Student Workflow
1. **Login** as student → Redirected to Student Dashboard
2. **View Published Assignments** → Only see assignments in "Published" status
3. **Submit Answer** → Provide text-based response (one per assignment)
4. **View Submission** → See submitted answer and timestamp (read-only)

## 🏗 Project Structure

```
Dashboard/
├── backend/                 # Node.js backend
│   ├── models/             # Mongoose schemas
│   │   ├── User.js
│   │   ├── Assignment.js
│   │   └── Submission.js
│   ├── routes/             # Express route handlers
│   │   ├── auth.js
│   │   ├── assignments.js
│   │   └── submissions.js
│   ├── middleware/         # Custom middleware
│   │   └── auth.js
│   ├── .env               # Environment variables
│   ├── server.js          # Main server file
│   ├── seeder.js          # Test data generator
│   └── package.json
│
└── frontend/               # React.js frontend
    ├── public/             # Static assets
    ├── src/
    │   ├── auth/           # Authentication context
    │   │   └── AuthContext.js
    │   ├── pages/          # React components
    │   │   ├── LoginPage.js
    │   │   ├── RegisterPage.js
    │   │   ├── TeacherDashboard.js
    │   │   └── StudentDashboard.js
    │   ├── utils/          # Utilities
    │   │   └── api.js
    │   ├── App.js          # Main app component
    │   ├── index.js        # React entry point
    │   └── styles.css      # Global styles
    └── package.json
```

## 🎯 Key Features Demonstrated

### Workflow Management
- **State Transitions**: Enforced workflow states with validation
- **Business Rules**: Role-based access control and submission restrictions
- **Data Integrity**: Proper foreign key relationships and constraints

### Modern Development Practices
- **RESTful API Design**: Consistent endpoint structure and HTTP methods
- **JWT Authentication**: Stateless authentication with role-based access
- **React Best Practices**: Hooks, Context API, and component composition
- **Responsive Design**: Mobile-first approach with flexible layouts

### Security Implementation
- **Password Security**: bcrypt hashing with salt rounds
- **Authentication Tokens**: Secure JWT with expiration
- **Input Validation**: Both client-side and server-side validation
- **Access Control**: Role-based permissions and route protection

## 🚀 Deployment

### Backend Deployment
1. Set environment variables on hosting platform
2. Ensure MongoDB connection string is accessible
3. Deploy to services like Heroku, Railway, or AWS

### Frontend Deployment
1. Build the React application: `npm run build`
2. Deploy to static hosting: Netlify, Vercel, or AWS S3
3. Configure API URL for production environment

## 🐛 Troubleshooting

### Common Issues
- **Connection Refused**: Ensure backend server is running on port 5000
- **Authentication Errors**: Check JWT secret and token expiration
- **Database Connection**: Verify MongoDB URI and network access
- **CORS Errors**: Confirm frontend URL is allowed in CORS configuration

### Development Tips
- Use browser developer tools to inspect network requests
- Check console logs for detailed error messages
- Verify environment variables are loaded correctly
- Test API endpoints with tools like Postman or curl

## 📈 Future Enhancements

### Potential Improvements
- **File Uploads**: Support for document and image submissions
- **Rich Text Editor**: Enhanced text formatting for assignments and answers
- **Email Notifications**: Automated notifications for assignment updates
- **Grading System**: Numeric grading with gradebooks
- **Analytics Dashboard**: Assignment statistics and student progress
- **Real-time Updates**: WebSocket integration for live updates
- **Mobile Apps**: Native iOS/Android applications
- **Advanced Filtering**: Search, sorting, and advanced filtering options

### Performance Optimizations
- **Database Indexing**: Optimize MongoDB queries
- **Caching**: Redis caching for frequently accessed data
- **CDN Integration**: Content delivery network for static assets
- **Code Splitting**: Lazy loading for React components
- **API Rate Limiting**: Prevent API abuse and improve stability

## 👥 Contributing

This project was built according to the specified requirements for an Assignment Workflow Portal. The implementation includes all requested features:

- Single login page with role-based redirection
- Teacher dashboard with complete assignment lifecycle management
- Student dashboard with assignment viewing and submission capabilities
- Proper workflow state transitions and business rule enforcement
- Modern React.js and Node.js architecture with security best practices

## 📄 License

This project is created for educational and demonstration purposes. Please ensure appropriate licensing for any production use.

## 🆘 Support

For questions or issues with the assignment portal:

1. Check the troubleshooting section above
2. Review the detailed README files in `/backend` and `/frontend` directories
3. Inspect browser console and server logs for error messages
4. Verify all environment variables are correctly configured

The application is fully functional and ready for testing with the provided test accounts and seeded data.