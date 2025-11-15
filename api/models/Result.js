import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  caScore: {
    type: Number,
    min: 0,
    max: 30
  },
  examScore: {
    type: Number,
    min: 0,
    max: 70
  },
  totalScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  grade: {
    type: String,
    enum: ['A', 'B', 'C', 'D', 'E', 'F']
  },
  gradePoint: {
    type: Number,
    min: 0,
    max: 5
  },
  level: {
    type: Number,
    required: true
  },
  semester: {
    type: String,
    required: true,
    enum: ['First', 'Second']
  },
  session: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Compound index to ensure one result per user per course per session and semester
// This allows the same course to be added multiple times if in different sessions or semesters
resultSchema.index({ user: 1, course: 1, session: 1, semester: 1 }, { unique: true });

// Calculate total score, grade and grade point
resultSchema.pre('validate', function(next) {
  // Recalculate total score from CA and Exam scores if both are provided
  if (this.caScore !== undefined && this.examScore !== undefined) {
    this.totalScore = this.caScore + this.examScore;
  }
  
  // Calculate grade and grade point based on total score
  if (this.totalScore !== undefined) {
    if (this.totalScore >= 70) {
      this.grade = 'A';
      this.gradePoint = 5.0;
    } else if (this.totalScore >= 60) {
      this.grade = 'B';
      this.gradePoint = 4.0;
    } else if (this.totalScore >= 50) {
      this.grade = 'C';
      this.gradePoint = 3.0;
    } else if (this.totalScore >= 45) {
      this.grade = 'D';
      this.gradePoint = 2.0;
    } else if (this.totalScore >= 40) {
      this.grade = 'E';
      this.gradePoint = 1.0;
    } else {
      this.grade = 'F';
      this.gradePoint = 0.0;
    }
  }
  next();
});

export default mongoose.model('Result', resultSchema);

