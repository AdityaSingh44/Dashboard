# Assignment Portal - Frontend

This is a minimal React frontend for the Assignment Workflow Portal.

## Setup

1. Install dependencies:

```powershell
cd frontend; npm install
```

2. Start the dev server (ensure backend is running at `http://localhost:5000` or set `REACT_APP_API_URL`):

```powershell
npm start
```

3. Use the Login page to sign in. Create users via the backend `POST /api/auth/register` if needed.

Notes:
- This is a minimal UI for demonstration. It uses the browser `prompt` for student submissions and a simple alert to show submissions. You can enhance styling and UX later.
