# GPA Checker API

Backend API for the CGPA Checker application built with Express, MongoDB, and Mongoose.

## Features

- User authentication (JWT-based)
- Results upload and management
- Real-time CGPA calculation
- CGPA simulation
- Improvement suggestions based on past performance

## Setup

1. Install dependencies:
```bash
bun install
```

2. Create a `.env` file in the `api` directory:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gpa-checker
JWT_SECRET=your-secret-key-change-this-in-production
NODE_ENV=development
```

3. Make sure MongoDB is running on your system.

4. Start the server:
```bash
bun run dev
```

The API will be available at `http://localhost:5000`

**Note**: Uses Bun runtime with `--watch` flag for hot reload during development.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Results
- `GET /api/results` - Get all results for authenticated user
- `POST /api/results` - Upload/add a result
- `PUT /api/results/:id` - Update a result
- `DELETE /api/results/:id` - Delete a result

### CGPA
- `GET /api/cgpa` - Get CGPA data
- `POST /api/cgpa/simulate` - Simulate CGPA with projected scores
- `GET /api/cgpa/suggestions` - Get improvement suggestions

## Models

### User
- name: String
- email: String (unique)
- password: String (hashed)
- studentId: String (optional)

### Course
- code: String
- name: String
- creditHours: Number
- level: Number
- semester: String (First/Second)
- session: String

### Result
- user: ObjectId (ref: User)
- course: ObjectId (ref: Course)
- caScore: Number (0-40)
- examScore: Number (0-60)
- totalScore: Number (0-100)
- grade: String (A-F)
- gradePoint: Number (0-5)
- level: Number
- semester: String
- session: String

