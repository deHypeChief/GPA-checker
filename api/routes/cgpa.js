import express from 'express';
import { body, validationResult } from 'express-validator';
import { authenticate } from '../middleware/auth.js';
import Result from '../models/Result.js';
import Course from '../models/Course.js';

const router = express.Router();

// Calculate CGPA
const calculateCGPA = (results) => {
  if (results.length === 0) return { cgpa: 0, totalPoints: 0, totalCreditHours: 0 };

  let totalPoints = 0;
  let totalCreditHours = 0;

  results.forEach(result => {
    const creditHours = result.course.creditHours;
    const points = result.gradePoint * creditHours;
    totalPoints += points;
    totalCreditHours += creditHours;
  });

  const cgpa = totalCreditHours > 0 ? totalPoints / totalCreditHours : 0;

  return {
    cgpa: parseFloat(cgpa.toFixed(2)),
    totalPoints,
    totalCreditHours
  };
};

// Get CGPA
router.get('/', authenticate, async (req, res) => {
  try {
    const results = await Result.find({ user: req.user._id }).populate('course');
    const cgpaData = calculateCGPA(results);

    // Get CGPA by level and semester
    const byLevel = {};
    const bySemester = {};

    results.forEach(result => {
      const level = result.level;
      const semester = `${result.session} - ${result.semester}`;

      if (!byLevel[level]) {
        byLevel[level] = [];
      }
      byLevel[level].push(result);

      if (!bySemester[semester]) {
        bySemester[semester] = [];
      }
      bySemester[semester].push(result);
    });

    const cgpaByLevel = {};
    Object.keys(byLevel).forEach(level => {
      cgpaByLevel[level] = calculateCGPA(byLevel[level]);
    });

    const cgpaBySemester = {};
    Object.keys(bySemester).forEach(semester => {
      cgpaBySemester[semester] = calculateCGPA(bySemester[semester]);
    });

    res.json({
      overall: cgpaData,
      byLevel: cgpaByLevel,
      bySemester: cgpaBySemester,
      results: results.length
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Simulate CGPA
router.post('/simulate', authenticate, [
  body('courseCode').notEmpty().withMessage('Course code is required'),
  body('courseName').notEmpty().withMessage('Course name is required'),
  body('creditHours').isInt({ min: 1 }).withMessage('Credit hours must be at least 1'),
  body('caScore').isFloat({ min: 0, max: 30 }).withMessage('CA score must be between 0 and 30'),
  body('examScore').isFloat({ min: 0, max: 70 }).withMessage('Exam score must be between 0 and 70'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { courseCode, courseName, creditHours, caScore, examScore } = req.body;
    const totalScore = caScore + examScore;

    // Calculate grade and grade point
    let grade, gradePoint;
    if (totalScore >= 70) {
      grade = 'A';
      gradePoint = 5.0;
    } else if (totalScore >= 60) {
      grade = 'B';
      gradePoint = 4.0;
    } else if (totalScore >= 50) {
      grade = 'C';
      gradePoint = 3.0;
    } else if (totalScore >= 45) {
      grade = 'D';
      gradePoint = 2.0;
    } else if (totalScore >= 40) {
      grade = 'E';
      gradePoint = 1.0;
    } else {
      grade = 'F';
      gradePoint = 0.0;
    }

    // Get existing results
    const existingResults = await Result.find({ user: req.user._id }).populate('course');

    // Create simulated result
    const simulatedResult = {
      course: {
        code: courseCode,
        name: courseName,
        creditHours: parseInt(creditHours)
      },
      gradePoint,
      grade,
      totalScore
    };

    // Calculate current CGPA
    const currentCGPA = calculateCGPA(existingResults);

    // Calculate simulated CGPA (check if course already exists)
    const existingCourseIndex = existingResults.findIndex(
      r => r.course.code === courseCode
    );

    let simulatedResults = [...existingResults];
    if (existingCourseIndex >= 0) {
      // Replace existing course result
      simulatedResults[existingCourseIndex] = {
        ...existingResults[existingCourseIndex],
        gradePoint,
        grade,
        totalScore
      };
    } else {
      // Add new course result
      simulatedResults.push(simulatedResult);
    }

    const simulatedCGPA = calculateCGPA(simulatedResults);

    res.json({
      current: currentCGPA,
      simulated: simulatedCGPA,
      change: parseFloat((simulatedCGPA.cgpa - currentCGPA.cgpa).toFixed(2)),
      course: {
        code: courseCode,
        name: courseName,
        creditHours,
        caScore,
        examScore,
        totalScore,
        grade,
        gradePoint
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get improvement suggestions
router.get('/suggestions', authenticate, async (req, res) => {
  try {
    const results = await Result.find({ user: req.user._id }).populate('course');

    if (results.length === 0) {
      return res.json({
        suggestions: [],
        weakAreas: [],
        strongAreas: [],
        stats: {
          totalCourses: 0,
          weakCourses: 0,
          strongCourses: 0,
          eGrades: 0
        },
        predictiveInsights: []
      });
    }

    // Find weak areas (grades C, D, E, F)
    const weakResults = results.filter(r => ['C', 'D', 'E', 'F'].includes(r.grade));
    const weakAreas = weakResults.map(r => ({
      courseCode: r.course.code,
      courseName: r.course.name,
      grade: r.grade,
      totalScore: r.totalScore,
      creditHours: r.course.creditHours
    }));

    // Find strong areas (grade A)
    const strongResults = results.filter(r => r.grade === 'A');
    const strongAreas = strongResults.map(r => ({
      courseCode: r.course.code,
      courseName: r.course.name,
      grade: r.grade,
      totalScore: r.totalScore
    }));

    // Generate suggestions
    const suggestions = [];
    
    if (weakAreas.length > 0) {
      suggestions.push({
        type: 'improvement',
        title: 'Focus on Weak Courses',
        message: `You have ${weakAreas.length} course(s) with grades below B. Consider focusing more study time on these courses.`,
        courses: weakAreas.map(w => w.courseCode).join(', ')
      });
    }

    // Calculate average by course type (if we can identify patterns)
    const coursePatterns = {};
    results.forEach(r => {
      const prefix = r.course.code.substring(0, 3);
      if (!coursePatterns[prefix]) {
        coursePatterns[prefix] = [];
      }
      coursePatterns[prefix].push(r.gradePoint);
    });

    Object.keys(coursePatterns).forEach(prefix => {
      const avg = coursePatterns[prefix].reduce((a, b) => a + b, 0) / coursePatterns[prefix].length;
      if (avg < 3.0) {
        suggestions.push({
          type: 'pattern',
          title: `Weak Performance in ${prefix} Courses`,
          message: `Your average in ${prefix} courses is ${avg.toFixed(2)}. Consider getting additional help in this area.`
        });
      }
    });

    const predictiveInsights = [];

    const eCount = results.filter(r => r.grade === 'E').length;
    if (eCount > 0) {
      predictiveInsights.push('If you get two more E grades next semester, a first-class finish becomes unrealistic—lock down those weak spots now.');
    }

    const hundredLevelResults = results.filter(r => r.level === 100);
    const twoHundredLevelResults = results.filter(r => r.level === 200);
    if (hundredLevelResults.length > 0) {
      const hundredCGPA = calculateCGPA(hundredLevelResults).cgpa;
      const twoHundredCGPA = twoHundredLevelResults.length > 0 ? calculateCGPA(twoHundredLevelResults).cgpa : null;
      predictiveInsights.push('80% of students see a large drop in grades after 100 level—keep your 200 level GPA at 3.5 or above to stay in first-class contention.');
      if (twoHundredCGPA !== null && twoHundredCGPA < 3.5) {
        predictiveInsights.push('Your 200 level CGPA is already below 3.5; double down on consistent study habits to remain competitive.');
      } else if (hundredCGPA >= 4.5) {
        predictiveInsights.push('You have a strong 100 level foundation—sustain at least a 3.5 CGPA in higher levels to protect your first-class trajectory.');
      }
    }

    const heavyCourses = results.filter(r => r.course.creditHours >= 3 && r.grade !== 'A');
    if (heavyCourses.length > 0) {
      predictiveInsights.push('Focus entirely on getting more A grades in 3-unit courses—they swing your CGPA faster than lighter classes.');
    }

    const defaultInsights = [
      'If you get two more E grades next semester, a first-class finish becomes unrealistic—lock down those weak spots now.',
      '80% of students see a large drop in grades after 100 level—keep your 200 level GPA at 3.5 or above to stay in first-class contention.',
      'Focus entirely on getting more A grades in 3-unit courses—they swing your CGPA faster than lighter classes.'
    ];
    defaultInsights.forEach(message => {
      if (!predictiveInsights.includes(message)) {
        predictiveInsights.push(message);
      }
    });

    res.json({
      suggestions,
      weakAreas,
      strongAreas,
      stats: {
        totalCourses: results.length,
        weakCourses: weakAreas.length,
        strongCourses: strongAreas.length,
        eGrades: eCount
      },
      predictiveInsights
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

