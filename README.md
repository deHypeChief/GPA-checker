# CGPA Checker

A comprehensive academic performance tracking application that allows students to upload their results, calculate CGPA in real-time, view charts, simulate CGPA with projected scores, get improvement suggestions, and export results in a social media-friendly format.

## Features

1. **Results Upload**: Manually upload course results with CA and exam scores
2. **Real-time CGPA Calculation**: Automatically calculate CGPA based on uploaded results
3. **Interactive Charts**: Visualize CGPA trends, grade distribution, and performance by level
4. **CGPA Simulation**: Simulate how projected CA and exam scores would affect your CGPA
5. **Improvement Suggestions**: Get personalized recommendations based on past performance
6. **Export Results**: Export CGPA results as PNG images optimized for social media sharing

## Tech Stack

### Backend
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Node.js

### Frontend
- React
- Vite
- React Router
- Recharts (for charts)
- html2canvas (for export)
- Axios (for API calls)

## Color Theme

- **Royal Blue**: #4169E1
- **Yellow**: #FFD700
- **Gray**: #808080
- **White**: #FFFFFF

## Quick Start (Run Both Concurrently)

### Prerequisites

- [Bun](https://bun.sh) (v1.0.0 or higher) - [Install Bun](https://bun.sh/docs/installation)
- MongoDB (running locally or connection string)

### Installation & Setup

1. **Install all dependencies** (root, backend, and frontend):
```bash
bun run install:all
```

Or manually:
```bash
bun install
cd api && bun install && cd ..
cd frontend && bun install && cd ..
```

2. **Create environment files**:

   - Create `api/.env`:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/gpa-checker
   JWT_SECRET=your-secret-key-change-this-in-production
   NODE_ENV=development
   ```

   - Create `frontend/.env` (optional):
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

3. **Start both servers concurrently**:
```bash
bun run dev
```

This will start:
- Backend API at `http://localhost:5000`
- Frontend at `http://localhost:5173` (or the port Vite assigns)

### Alternative: Run Separately

If you prefer to run them separately:

**Backend:**
```bash
cd api
bun install
bun run dev
```

**Frontend (in a new terminal):**
```bash
cd frontend
bun install
bun run dev
```

## Usage

1. **Register/Login**: Create an account or login with existing credentials
2. **Upload Results**: Add your course results manually with CA and exam scores
3. **View Dashboard**: See your current CGPA and quick statistics
4. **View Charts**: Explore your academic performance through interactive charts
5. **Simulate CGPA**: Enter projected scores to see how they would affect your CGPA
6. **Get Suggestions**: View personalized improvement recommendations
7. **Export Results**: Download your CGPA results as a PNG image for sharing

## Project Structure

```
GPA-checker/
├── api/
│   ├── models/
│   │   ├── User.js
│   │   ├── Course.js
│   │   └── Result.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── results.js
│   │   └── cgpa.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ResultsUpload.jsx
│   │   │   ├── CGPACharts.jsx
│   │   │   ├── CGPASimulator.jsx
│   │   │   ├── ImprovementSuggestions.jsx
│   │   │   ├── ExportCGPA.jsx
│   │   │   └── PrivateRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── README.md
```

## API Documentation

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Results
- `GET /api/results` - Get all results (requires authentication)
- `POST /api/results` - Upload a result (requires authentication)
- `PUT /api/results/:id` - Update a result (requires authentication)
- `DELETE /api/results/:id` - Delete a result (requires authentication)

### CGPA
- `GET /api/cgpa` - Get CGPA data (requires authentication)
- `POST /api/cgpa/simulate` - Simulate CGPA (requires authentication)
- `GET /api/cgpa/suggestions` - Get improvement suggestions (requires authentication)

## Grade System

- **A**: 70-100 (5.0 points)
- **B**: 60-69 (4.0 points)
- **C**: 50-59 (3.0 points)
- **D**: 45-49 (2.0 points)
- **E**: 40-44 (1.0 point)
- **F**: 0-39 (0.0 points)

## License

This project is open source and available under the MIT License.

