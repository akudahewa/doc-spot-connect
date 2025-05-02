
# MyClinic Management System

## How to Run the Application

### 1. Start the API Server

The backend API server needs to be running before the frontend can connect to it:

```bash
# Method 1: Using the start script (recommended)
# Make the script executable first (one-time setup)
chmod +x start-server.sh
# Then run the script
./start-server.sh

# Method 2: Manual setup
cd server
npm run setup
npm start
```

### 2. Start the Frontend

In a new terminal window:

```bash
npm run dev
```

This will start the Vite development server and you can access the application at http://localhost:8080

## Test Credentials

- Email: admin@example.com
- Password: 123456

## Notes

- The API server runs at http://localhost:5000 by default
- The MongoDB connection string is configured in server/.env
