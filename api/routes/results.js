import express from 'express';
import { body, validationResult } from 'express-validator';
import { authenticate } from '../middleware/auth.js';
import Result from '../models/Result.js';
import Course from '../models/Course.js';

const router = express.Router();

// Get all results for authenticated user
router.get('/', authenticate, async (req, res) => {
  try {
    const results = await Result.find({ user: req.user._id })
      .populate('course')
      .sort({ session: -1, level: -1, semester: 1 });

    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload/Add a result
router.post('/', authenticate, [
  body('courseCode').notEmpty().withMessage('Course code is required'),
  body('courseName').notEmpty().withMessage('Course name is required'),
  body('creditHours').isInt({ min: 1 }).withMessage('Credit hours must be at least 1'),
  body('level').isInt({ min: 100 }).withMessage('Level must be at least 100'),
  body('semester').isIn(['First', 'Second']).withMessage('Semester must be First or Second'),
  body('session').notEmpty().withMessage('Session is required'),
  body('totalScore').isFloat({ min: 0, max: 100 }).withMessage('Total score must be between 0 and 100'),
  body('caScore').optional().isFloat({ min: 0, max: 30 }).withMessage('CA score must be between 0 and 30'),
  body('examScore').optional().isFloat({ min: 0, max: 70 }).withMessage('Exam score must be between 0 and 70'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      courseCode,
      courseName,
      creditHours,
      level,
      semester,
      session,
      totalScore,
      caScore,
      examScore
    } = req.body;

    // Find or create course
    let course = await Course.findOne({ code: courseCode, session, level });
    if (!course) {
      course = new Course({
        code: courseCode,
        name: courseName,
        creditHours,
        level,
        semester,
        session
      });
      await course.save();
    }

    // Check if result already exists for this specific combination of user, course, session, and semester
    let result = await Result.findOne({ 
      user: req.user._id, 
      course: course._id,
      session: session,
      semester: semester
    });
    
    if (result) {
      result.level = level;
    } else {
      // Create new result (totalScore, grade, gradePoint will be calculated in pre-validate hook)
      // This allows adding the same course multiple times if in different sessions or semesters
      result = new Result({
        user: req.user._id,
        course: course._id,
        level,
        semester,
        session
      });
    }

    if (caScore !== undefined) {
      result.caScore = Number(caScore);
    }
    if (examScore !== undefined) {
      result.examScore = Number(examScore);
    }
    result.totalScore = Number(totalScore);

    await result.save();
    await result.populate('course');

    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Result already exists for this course' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a result
router.put('/:id', authenticate, [
  body('totalScore').optional().isFloat({ min: 0, max: 100 }),
  body('caScore').optional().isFloat({ min: 0, max: 30 }),
  body('examScore').optional().isFloat({ min: 0, max: 70 }),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const result = await Result.findOne({ _id: req.params.id, user: req.user._id });
    if (!result) {
      return res.status(404).json({ message: 'Result not found' });
    }

    if (req.body.caScore !== undefined) result.caScore = req.body.caScore;
    if (req.body.examScore !== undefined) result.examScore = req.body.examScore;
    if (req.body.totalScore !== undefined) result.totalScore = req.body.totalScore;
    // totalScore, grade, and gradePoint will be automatically calculated in pre-validate hook

    await result.save();
    await result.populate('course');

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a result
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const result = await Result.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!result) {
      return res.status(404).json({ message: 'Result not found' });
    }

    res.json({ message: 'Result deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

