import { useState } from 'react';
import { cgpaAPI } from '../services/api';
import '../App.css';

const CGPASimulator = ({ results, onSimulate }) => {
  const [formData, setFormData] = useState({
    courseCode: '',
    courseName: '',
    creditHours: '',
    caScore: '',
    examScore: '',
  });
  const [simulation, setSimulation] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
    setSimulation(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await cgpaAPI.simulate({
        ...formData,
        creditHours: parseInt(formData.creditHours),
        caScore: parseFloat(formData.caScore),
        examScore: parseFloat(formData.examScore),
      });
      setSimulation(response.data);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to simulate CGPA');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="card">
        <h2 style={{ color: 'var(--royal-blue)', marginBottom: '20px' }}>
          Simulate CGPA
        </h2>
        <p style={{ color: 'var(--gray)', marginBottom: '20px' }}>
          Enter projected CA (max 30) and Exam (max 70) scores to see how they would affect your CGPA.
        </p>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            <div className="form-group">
              <label htmlFor="courseCode">Course Code *</label>
              <input
                type="text"
                id="courseCode"
                name="courseCode"
                value={formData.courseCode}
                onChange={handleChange}
                required
                placeholder="e.g., CSC 101"
              />
            </div>

            <div className="form-group">
              <label htmlFor="courseName">Course Name *</label>
              <input
                type="text"
                id="courseName"
                name="courseName"
                value={formData.courseName}
                onChange={handleChange}
                required
                placeholder="e.g., Introduction to Computer Science"
              />
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
              />
            </div>

            <div className="form-group">
              <label htmlFor="caScore">Projected CA Score (0-30) *</label>
              <input
                type="number"
                id="caScore"
                name="caScore"
                value={formData.caScore}
                onChange={handleChange}
                required
                min="0"
                max="30"
                step="0.1"
                placeholder="e.g., 24"
              />
            </div>

            <div className="form-group">
              <label htmlFor="examScore">Projected Exam Score (0-70) *</label>
              <input
                type="number"
                id="examScore"
                name="examScore"
                value={formData.examScore}
                onChange={handleChange}
                required
                min="0"
                max="70"
                step="0.1"
                placeholder="e.g., 58"
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ marginTop: '20px' }}
          >
            {loading ? 'Simulating...' : 'Simulate CGPA'}
          </button>
        </form>
      </div>

      {simulation && (
        <div className="card" style={{
          background: 'linear-gradient(135deg, #4169E1 0%, #1E3A8A 100%)',
          color: 'var(--white)'
        }}>
          <h3 style={{ marginBottom: '24px', color: 'var(--white)' }}>
            Simulation Results
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '24px' }}>
            <div style={{
              padding: '20px',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '14px', opacity: 0.9, margin: 0 }}>Current CGPA</p>
              <p style={{ fontSize: '36px', fontWeight: 'bold', margin: '8px 0 0 0' }}>
                {simulation.current.cgpa.toFixed(2)}
              </p>
            </div>
            <div style={{
              padding: '20px',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '14px', opacity: 0.9, margin: 0 }}>Simulated CGPA</p>
              <p style={{ fontSize: '36px', fontWeight: 'bold', margin: '8px 0 0 0' }}>
                {simulation.simulated.cgpa.toFixed(2)}
              </p>
            </div>
            <div style={{
              padding: '20px',
              background: simulation.change >= 0 ? 'rgba(184, 134, 11, 0.3)' : 'rgba(220, 53, 69, 0.3)',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '14px', opacity: 0.9, margin: 0 }}>Change</p>
              <p style={{ fontSize: '36px', fontWeight: 'bold', margin: '8px 0 0 0' }}>
                {simulation.change >= 0 ? '+' : ''}{simulation.change.toFixed(2)}
              </p>
            </div>
          </div>

          <div style={{
            padding: '20px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '8px',
            marginTop: '20px'
          }}>
            <h4 style={{ marginBottom: '12px' }}>Course Details:</h4>
            <p><strong>Course:</strong> {simulation.course.code} - {simulation.course.name}</p>
            <p><strong>Credit Units:</strong> {simulation.course.creditHours}</p>
            <p><strong>CA Score:</strong> {simulation.course.caScore}/30</p>
            <p><strong>Exam Score:</strong> {simulation.course.examScore}/70</p>
            <p><strong>Total Score:</strong> {simulation.course.totalScore}/100</p>
            <p><strong>Grade:</strong> {simulation.course.grade} ({simulation.course.gradePoint} points)</p>
          </div>

          {simulation.change > 0 && (
            <div style={{
              marginTop: '20px',
              padding: '16px',
              background: 'rgba(255, 215, 0, 0.2)',
              borderRadius: '8px',
              border: '2px solid #FFD700'
            }}>
              <p style={{ margin: 0, fontWeight: '600' }}>
                {(() => {
                  const current = simulation.current.cgpa || 0;
                  const delta = simulation.simulated.cgpa - current;
                  const percent = current > 0 ? (delta / current) * 100 : 0;
                  return `🎉 Great! This would improve your performance by ${percent.toFixed(1)}%.`;
                })()}
              </p>
            </div>
          )}

          {simulation.change < 0 && (
            <div style={{
              marginTop: '20px',
              padding: '16px',
              background: 'rgba(220, 53, 69, 0.2)',
              borderRadius: '8px',
              border: '2px solid #dc3545'
            }}>
              <p style={{ margin: 0, fontWeight: '600' }}>
                ⚠️ This would decrease your CGPA by {Math.abs(simulation.change).toFixed(2)} points. Consider improving your scores.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CGPASimulator;

