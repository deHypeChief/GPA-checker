# Quick Setup Guide

## Prerequisites

1. **Bun** (v1.0.0 or higher) - [Install Bun](https://bun.sh/docs/installation)
2. **MongoDB** - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free cloud option)

## Quick Start: Run Both Concurrently (Recommended)

1. **Install all dependencies from root**:
```bash
bun run install:all
```

2. **Create environment files**:
   - Create `api/.env`:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/gpa-checker
   JWT_SECRET=your-secret-key-change-this-in-production-make-it-long-and-random
   NODE_ENV=development
   ```
   
   - Create `frontend/.env` (optional):
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

3. **Make sure MongoDB is running** (if using local MongoDB):
   - On Windows: MongoDB should start automatically if installed as a service
   - On Mac/Linux: `mongod` (or `brew services start mongodb-community` on Mac)

4. **Start both servers concurrently from root**:
```bash
bun run dev
```

This will start:
- Backend API at `http://localhost:5000`
- Frontend at `http://localhost:5173` (or the port Vite assigns)

## Alternative: Setup Separately

### Step 1: Setup Backend

1. Navigate to the `api` directory:
```bash
cd api
```

2. Install dependencies:
```bash
bun install
```

3. Create a `.env` file in the `api` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gpa-checker
JWT_SECRET=your-secret-key-change-this-in-production-make-it-long-and-random
NODE_ENV=development
```

**Note**: If using MongoDB Atlas, replace `MONGODB_URI` with your Atlas connection string.

4. Make sure MongoDB is running (if using local MongoDB):
   - On Windows: MongoDB should start automatically if installed as a service
   - On Mac/Linux: `mongod` (or `brew services start mongodb-community` on Mac)

5. Start the backend server:
```bash
bun run dev
```

You should see:
```
Connected to MongoDB
Server is running on port 5000
```

### Step 2: Setup Frontend

1. Open a new terminal and navigate to the `frontend` directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
bun install
```

3. (Optional) Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the frontend development server:
```bash
bun run dev
```

You should see the application running at `http://localhost:5173` (or another port if 5173 is busy).

## Step 3: Use the Application

1. Open your browser and go to `http://localhost:5173`
2. Register a new account or login
3. Start uploading your results!
4. Explore the dashboard, charts, simulations, and export features

## Troubleshooting

### MongoDB Connection Issues

- **Error: "MongoDB connection error"**
  - Make sure MongoDB is running
  - Check your `MONGODB_URI` in the `.env` file
  - If using MongoDB Atlas, make sure your IP is whitelisted

### Port Already in Use

- **Error: "Port 5000 already in use"**
  - Change the `PORT` in `api/.env` to a different port (e.g., 5001)
  - Update `VITE_API_URL` in `frontend/.env` accordingly

### CORS Issues

- If you see CORS errors in the browser console:
  - Make sure the backend is running
  - Check that `VITE_API_URL` matches your backend URL
  - Verify the proxy configuration in `frontend/vite.config.js`

### Dependencies Issues

- **Error: "Cannot find module"**
  - Delete `node_modules` and `bun.lockb` (or `package-lock.json`)
  - Run `bun install` again

## Production Deployment

### Backend

1. Set `NODE_ENV=production` in `.env`
2. Use a strong `JWT_SECRET`
3. Use a production MongoDB instance (MongoDB Atlas recommended)
4. Use Bun's built-in process management or PM2:
```bash
# Using Bun
bun run start:api

# Or using PM2
bun install -g pm2
pm2 start server.js --name gpa-checker-api --interpreter bun
```

### Frontend

1. Build the frontend:
```bash
cd frontend
bun run build
```

2. The `dist` folder contains the production build
3. Deploy to a static hosting service (Vercel, Netlify, etc.)
4. Update `VITE_API_URL` to point to your production API

## Need Help?

- Check the main `README.md` for detailed documentation
- Review the API documentation in `api/README.md`
- Check the browser console and server logs for error messages

