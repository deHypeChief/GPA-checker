import { useState } from 'react';
import { resultsAPI } from '../services/api';
import '../App.css';

const COURSES = [
  { code: 'COS 101', name: 'INTRODUCTION TO COMPUTER SCIENCE', credits: 3 },
  { code: 'MTH 121', name: 'ELEMENTARY MATHEMATICS', credits: 3 },
  { code: 'PHY 115', name: 'GENERAL PHYSICS FOR PHYSICAL SCIENCE I', credits: 3 },
  { code: 'GSP 111', name: 'USE OF LIBRARY & STUDY SKILLS', credits: 2 },
  { code: 'GSP 101', name: 'USE OF ENGLISH I', credits: 2 },
  { code: 'MTH 111', name: 'ELEMENTARY MATHEMATICS I', credits: 3 },
  { code: 'PHY 121', name: 'FUNDAMENTALS OF PHYSICS I', credits: 3 },
  { code: 'COS 141', name: 'COMPUTER HARDWARE', credits: 3 },
  { code: 'MTH 122', name: 'ELEMENTARY MATHEMATICS III', credits: 3 },
  { code: 'PHY 116', name: 'GENERAL PHYSICS FOR PHYSICAL SCIENCES II', credits: 2 },
  { code: 'PHY 118', name: 'GENERAL PHYSICS FOR PHYSICAL SCIENCE III', credits: 2 },
  { code: 'STA 132', name: 'INFERENCEII', credits: 2 },
  { code: 'STAT172', name: 'STATISTICAL COMPUTING', credits: 2 },
  { code: 'GSP 102', name: 'USE OF ENGLISH II', credits: 2 },
  { code: 'COS 102', name: 'INTRODUCTION TO PROBLEM SOLVING', credits: 3 },
  { code: 'COS 124', name: 'INTRODUCTION TO DATABASE SYSTEM', credits: 3 },
];

const ResultsUpload = ({ results, onResultAdded, onResultDeleted }) => {
  const [formData, setFormData] = useState({
    courseCode: '',
    courseName: '',
    creditHours: '',
    level: '',
    semester: 'First',
    session: '',
    totalScore: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
    setSuccess('');
  };

  const handleCourseSelect = (e) => {
    const selectedCourse = COURSES.find(course => course.code === e.target.value);
    if (selectedCourse) {
      setFormData({
        ...formData,
        courseCode: selectedCourse.code,
        courseName: selectedCourse.name,
        creditHours: selectedCourse.credits.toString(),
      });
    } else {
      setFormData({
        ...formData,
        courseCode: '',
        courseName: '',
        creditHours: '',
      });
    }
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await resultsAPI.create({
        ...formData,
        creditHours: parseInt(formData.creditHours),
        level: parseInt(formData.level),
        totalScore: parseFloat(formData.totalScore),
      });
      setSuccess('Result added successfully!');
      setFormData({
        courseCode: '',
        courseName: '',
        creditHours: '',
        level: '',
        semester: 'First',
        session: '',
        totalScore: '',
      });
      onResultAdded();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add result');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this result?')) {
      return;
    }

    try {
      await resultsAPI.delete(id);
      onResultDeleted();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete result');
    }
  };

  return (
    <div>
      <div className="card">
        <h2 style={{ color: 'var(--royal-blue)', marginBottom: '20px' }}>
          Upload Results
        </h2>

        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            <div className="form-group">
              <label htmlFor="courseSelect">Select Course *</label>
              <select
                id="courseSelect"
                name="courseSelect"
                value={formData.courseCode}
                onChange={handleCourseSelect}
                required
              >
                <option value="">-- Select a course --</option>
                {COURSES.map(course => (
                  <option key={course.code} value={course.code}>
                    {course.code} - {course.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="creditHours">Credit Units *</label>
              <input
                type="number"
                id="creditHours"
                name="creditHours"
                value={formData.creditHours}
                onChange={handleChange}
                required
                min="1"
                placeholder="e.g., 3"
                readOnly
              />
            </div>

            <div className="form-group">
              <label htmlFor="level">Level *</label>
              <input
                type="number"
                id="level"
                name="level"
                value={formData.level}
                onChange={handleChange}
                required
                min="100"
                placeholder="e.g., 100"
              />
            </div>

            <div className="form-group">
              <label htmlFor="semester">Semester *</label>
              <select
                id="semester"
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                required
              >
                <option value="First">First</option>
                <option value="Second">Second</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="session">Session *</label>
              <input
                type="text"
                id="session"
                name="session"
                value={formData.session}
                onChange={handleChange}
                required
                placeholder="e.g., 2023/2024"
              />
            </div>

            <div className="form-group">
              <label htmlFor="totalScore">Total Score (0-100) *</label>
              <input
                type="number"
                id="totalScore"
                name="totalScore"
                value={formData.totalScore}
                onChange={handleChange}
                required
                min="0"
                max="100"
                step="0.1"
                placeholder="e.g., 82"
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ marginTop: '20px' }}
          >
            {loading ? 'Adding...' : 'Add Result'}
          </button>
        </form>
      </div>

      <div className="card">
        <h3 style={{ color: 'var(--royal-blue)', marginBottom: '20px' }}>
          Your Results ({results.length})
        </h3>
        {results.length === 0 ? (
          <p style={{ color: 'var(--gray)', textAlign: 'center' }}>
            No results yet. Add your first result above!
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--light-gray)' }}>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid var(--gray)' }}>
                    Course Code
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid var(--gray)' }}>
                    Course Name
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid var(--gray)' }}>
                    Credit Units
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid var(--gray)' }}>
                    Total Score (/100)
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid var(--gray)' }}>
                    Grade
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid var(--gray)' }}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {results.map((result) => (
                  <tr key={result._id} style={{ borderBottom: '1px solid var(--light-gray)' }}>
                    <td style={{ padding: '12px' }}>{result.course?.code}</td>
                    <td style={{ padding: '12px' }}>{result.course?.name}</td>
                    <td style={{ padding: '12px' }}>{result.course?.creditHours}</td>
                    <td style={{ padding: '12px' }}>{result.totalScore}/100</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        background: result.grade === 'A' ? '#28a745' : 
                                   result.grade === 'B' ? '#17a2b8' :
                                   result.grade === 'C' ? '#ffc107' :
                                   result.grade === 'D' ? '#fd7e14' :
                                   result.grade === 'E' ? '#dc3545' : '#6c757d',
                        color: 'var(--white)',
                        fontWeight: 'bold'
                      }}>
                        {result.grade}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <button
                        onClick={() => handleDelete(result._id)}
                        className="btn"
                        style={{
                          background: '#dc3545',
                          color: 'var(--white)',
                          padding: '6px 12px',
                          fontSize: '14px'
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsUpload;

