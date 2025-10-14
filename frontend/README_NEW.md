# Assignment Portal Frontend

A React.js frontend for the Assignment Workflow Portal with role-based dashboards and responsive design.

## Features

- **Single Login Page**: Unified authentication for teachers and students
- **Role-based Routing**: Automatic redirection based on user role
- **Teacher Dashboard**: Create, manage, and review assignments with state transitions
- **Student Dashboard**: View published assignments and submit answers
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time State Management**: Context API for user authentication
- **Error Handling**: User-friendly error messages and validation

## Tech Stack

- **React.js 18** - Frontend library
- **React Router DOM** - Client-side routing
- **Context API** - State management
- **Axios** - HTTP client (via custom API utility)
- **CSS3** - Styling with modern design
- **Fetch API** - HTTP requests

## Quick Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Configuration (Optional):**
   Create a `.env` file in the frontend directory:
   ```env
   REACT_APP_API_URL=http://localhost:5000
   ```
   *Note: If not set, defaults to `http://localhost:5000`*

3. **Start the Development Server:**
   ```bash
   npm start
   ```

The application will open at `http://localhost:3000`

## Test Accounts

Use these test accounts to explore the application:

- **Teacher**: `teacher@test.com` / `teacher123`
- **Student 1**: `alice@test.com` / `student123`
- **Student 2**: `bob@test.com` / `student123`

*Note: Run the backend seeder to populate these accounts*

## Application Flow

### 1. Login Flow
1. User visits the login page at `/login`
2. Enters email and password
3. System authenticates and returns user role
4. Automatic redirect based on role:
   - **Teacher** → `/teacher` (Teacher Dashboard)
   - **Student** → `/student` (Student Dashboard)

### 2. Teacher Workflow
1. **Create Assignment**: Add title, description, and due date (starts in Draft status)
2. **Edit Assignment**: Modify details while in Draft status
3. **Publish Assignment**: Change status from Draft → Published (visible to students)
4. **Review Submissions**: View student answers and mark as reviewed
5. **Complete Assignment**: Change status from Published → Completed (locked)

### 3. Student Workflow
1. **View Published Assignments**: See only assignments in Published status
2. **Submit Answer**: Provide text-based answer (one per assignment)
3. **View Submitted Answers**: Review previously submitted work
4. **Track Status**: See submission timestamps and assignment due dates

## Features by Role

### Teacher Dashboard
- ✅ Create new assignments
- ✅ Edit assignments (Draft only)
- ✅ Delete assignments (Draft only)
- ✅ Filter assignments by status (Draft/Published/Completed)
- ✅ Publish assignments (Draft → Published)
- ✅ Mark assignments complete (Published → Completed)
- ✅ View all submissions for each assignment
- ✅ Mark submissions as reviewed

### Student Dashboard
- ✅ View only Published assignments
- ✅ Submit text-based answers
- ✅ View previously submitted answers
- ✅ One submission per assignment restriction
- ✅ Due date validation (no submissions after due date)
- ✅ Real-time submission status

## Component Structure

```
src/
├── App.js                 # Main app with routing
├── index.js              # React entry point
├── styles.css            # Global styles
├── auth/
│   └── AuthContext.js    # Authentication context
├── pages/
│   ├── LoginPage.js      # Login form
│   ├── RegisterPage.js   # Registration form
│   ├── TeacherDashboard.js # Teacher interface
│   └── StudentDashboard.js # Student interface
└── utils/
    └── api.js            # HTTP client utility
```

## API Integration

The frontend communicates with the backend through a custom API utility (`src/utils/api.js`) that:

- Handles JWT token management
- Provides consistent error handling
- Supports automatic token attachment to requests
- Manages API base URL configuration

### Key API Methods:
```javascript
// Authentication
api.post('/api/auth/login', { email, password })
api.post('/api/auth/register', { name, email, password, role })

// Assignments
api.get('/api/assignments')
api.post('/api/assignments', { title, description, dueDate })
api.put('/api/assignments/:id/status', { status })

// Submissions
api.post('/api/submissions', { assignmentId, answer })
api.get('/api/submissions/mine')
```

## State Management

Uses React Context API for global state management:

### AuthContext
- **User State**: Stores current user information (token, role, name)
- **Login Method**: Authenticates user and stores session
- **Logout Method**: Clears user session
- **Persistent Storage**: Automatically saves/restores from localStorage

## Security Features

- **JWT Token Management**: Automatic token attachment and storage
- **Role-based Access Control**: Route protection based on user role
- **Private Routes**: Redirects unauthenticated users to login
- **Input Validation**: Client-side form validation
- **Session Persistence**: Maintains login across browser sessions

## Responsive Design

The application is fully responsive and works across:
- **Desktop** (1200px+)
- **Tablet** (768px - 1199px)
- **Mobile** (320px - 767px)

### Key Responsive Features:
- Flexible grid layouts
- Responsive navigation
- Touch-friendly buttons
- Optimized form layouts
- Mobile-first CSS approach

## Styling

Modern, clean design with:
- **Color Scheme**: Professional blue and gray palette
- **Typography**: Inter font family for readability
- **Cards**: Clean card-based layouts
- **Buttons**: Consistent button styling with hover effects
- **Forms**: Well-spaced, accessible form controls
- **Status Badges**: Color-coded assignment status indicators

## Development

### Available Scripts
- `npm start` - Start development server (port 3000)
- `npm build` - Create production build
- `npm test` - Run test suite
- `npm eject` - Eject from Create React App (⚠️ irreversible)

### Development Guidelines
1. **Component Naming**: Use PascalCase for components
2. **File Organization**: Group related files in folders
3. **State Management**: Use Context for global state, local state for components
4. **Error Handling**: Always handle API errors gracefully
5. **User Experience**: Provide loading states and error feedback

## Browser Support

- **Chrome** (latest)
- **Firefox** (latest)
- **Safari** (latest)
- **Edge** (latest)

## Production Build

To create a production build:

```bash
npm run build
```

The build folder contains optimized files ready for deployment to any static hosting service.

## Testing

### Manual Testing Checklist

#### Authentication
- [ ] Login with valid credentials
- [ ] Login with invalid credentials (error handling)
- [ ] Logout functionality
- [ ] Auto-redirect based on role
- [ ] Session persistence across browser refresh

#### Teacher Workflow
- [ ] Create new assignment
- [ ] Edit draft assignment
- [ ] Cannot edit published/completed assignments
- [ ] Delete draft assignment
- [ ] Cannot delete published/completed assignments
- [ ] Publish assignment (Draft → Published)
- [ ] Complete assignment (Published → Completed)
- [ ] Filter assignments by status
- [ ] View submissions for assignments

#### Student Workflow
- [ ] View only published assignments
- [ ] Submit answer to assignment
- [ ] Cannot submit multiple answers to same assignment
- [ ] Cannot submit after due date
- [ ] View submitted answers
- [ ] Assignment filtering (auto-filtered to Published)

### API Error Scenarios
- [ ] Network connection issues
- [ ] Invalid authentication tokens
- [ ] Server errors (500)
- [ ] Not found errors (404)
- [ ] Permission errors (403)

## Deployment

### Environment Variables
For production deployment, set:
```env
REACT_APP_API_URL=https://your-backend-domain.com
```

### Static Hosting Options
- **Netlify**: Drag and drop build folder
- **Vercel**: Connect GitHub repository
- **AWS S3**: Upload build files to S3 bucket
- **GitHub Pages**: Use `gh-pages` package

## Future Enhancements

### Potential Improvements
- [ ] File upload support for assignments
- [ ] Rich text editor for submissions
- [ ] Assignment templates
- [ ] Email notifications
- [ ] Grading system
- [ ] Assignment categories/tags
- [ ] Dark mode support
- [ ] Offline support (PWA)
- [ ] Real-time notifications
- [ ] Assignment analytics dashboard

### UI/UX Enhancements
- [ ] Enhanced mobile experience
- [ ] Drag and drop file uploads
- [ ] Auto-save drafts
- [ ] Keyboard shortcuts
- [ ] Better loading states
- [ ] Toast notifications
- [ ] Confirmation dialogs
- [ ] Accessibility improvements (WCAG 2.1)

## Troubleshooting

### Common Issues

**Backend Connection Failed**
- Ensure backend server is running on port 5000
- Check if REACT_APP_API_URL is correctly set
- Verify CORS configuration on backend

**Authentication Issues**
- Clear localStorage and try login again
- Check if JWT token is expired
- Verify user exists in database

**UI Not Loading Correctly**
- Clear browser cache
- Check console for JavaScript errors
- Ensure all dependencies are installed

**Deployment Issues**
- Verify build process completes successfully
- Check environment variables in production
- Ensure API URLs use HTTPS in production