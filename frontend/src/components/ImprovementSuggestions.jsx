import '../App.css';

const ImprovementSuggestions = ({ suggestions }) => {
  if (!suggestions) {
    return (
      <div className="card">
        <p style={{ color: 'var(--gray)', textAlign: 'center' }}>
          Loading suggestions...
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ color: 'var(--royal-blue)', marginBottom: '24px' }}>
        Improvement Suggestions
      </h2>

      {/* Statistics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--royal-blue)', margin: 0 }}>
            {suggestions.stats?.totalCourses || 0}
          </p>
          <p style={{ color: 'var(--gray)', marginTop: '4px' }}>Total Courses</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#28a745', margin: 0 }}>
            {suggestions.stats?.strongCourses || 0}
          </p>
          <p style={{ color: 'var(--gray)', marginTop: '4px' }}>Strong Courses (A)</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#dc3545', margin: 0 }}>
            {suggestions.stats?.weakCourses || 0}
          </p>
          <p style={{ color: 'var(--gray)', marginTop: '4px' }}>Weak Courses</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#ffc107', margin: 0 }}>
            {suggestions.stats?.eGrades || 0}
          </p>
          <p style={{ color: 'var(--gray)', marginTop: '4px' }}>E Grades Recorded</p>
        </div>
      </div>

      {suggestions.predictiveInsights && suggestions.predictiveInsights.length > 0 && (
        <div className="card">
          <h3 style={{ color: 'var(--royal-blue)', marginBottom: '20px' }}>
            Predictive Insights
          </h3>
          {suggestions.predictiveInsights.map((insight, index) => (
            <div
              key={index}
              style={{
                padding: '16px',
                background: 'var(--light-gray)',
                borderRadius: '8px',
                marginBottom: '12px',
                borderLeft: '4px solid var(--yellow)'
              }}
            >
              <p style={{ color: 'var(--dark-gray)', margin: 0 }}>
                {insight}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Suggestions */}
      {suggestions.suggestions && suggestions.suggestions.length > 0 && (
        <div className="card">
          <h3 style={{ color: 'var(--royal-blue)', marginBottom: '20px' }}>
            Recommendations
          </h3>
          {suggestions.suggestions.map((suggestion, index) => (
            <div
              key={index}
              style={{
                padding: '16px',
                background: 'var(--light-gray)',
                borderRadius: '8px',
                marginBottom: '12px',
                borderLeft: '4px solid var(--royal-blue)'
              }}
            >
              <h4 style={{ color: 'var(--royal-blue)', marginBottom: '8px' }}>
                {suggestion.title}
              </h4>
              <p style={{ color: 'var(--dark-gray)', margin: 0 }}>
                {suggestion.message}
              </p>
              {suggestion.courses && (
                <p style={{ color: 'var(--gray)', marginTop: '8px', fontSize: '14px' }}>
                  <strong>Courses:</strong> {suggestion.courses}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Weak Areas */}
      {suggestions.weakAreas && suggestions.weakAreas.length > 0 && (
        <div className="card">
          <h3 style={{ color: '#dc3545', marginBottom: '20px' }}>
            Areas for Improvement
          </h3>
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
                    Grade
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid var(--gray)' }}>
                    Total Score
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid var(--gray)' }}>
                    Credit Units
                  </th>
                </tr>
              </thead>
              <tbody>
                {suggestions.weakAreas.map((course, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid var(--light-gray)' }}>
                    <td style={{ padding: '12px' }}>{course.courseCode}</td>
                    <td style={{ padding: '12px' }}>{course.courseName}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        background: '#dc3545',
                        color: 'var(--white)',
                        fontWeight: 'bold'
                      }}>
                        {course.grade}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>{course.totalScore}</td>
                    <td style={{ padding: '12px' }}>{course.creditHours}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Strong Areas */}
      {suggestions.strongAreas && suggestions.strongAreas.length > 0 && (
        <div className="card">
          <h3 style={{ color: '#b8860b', marginBottom: '20px' }}>
            Strong Areas (Keep it up!)
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
            {suggestions.strongAreas.map((course, index) => (
              <div
                key={index}
                style={{
                  padding: '16px',
                  background: 'var(--light-gray)',
                  borderRadius: '8px',
                  borderLeft: '4px solid #b8860b'
                }}
              >
                <p style={{ fontWeight: 'bold', margin: '0 0 4px 0' }}>
                  {course.courseCode}
                </p>
                <p style={{ fontSize: '14px', color: 'var(--gray)', margin: '0 0 8px 0' }}>
                  {course.courseName}
                </p>
                <span style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  background: '#b8860b',
                  color: 'var(--white)',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}>
                  Grade: {course.grade} ({course.totalScore}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {(!suggestions.suggestions || suggestions.suggestions.length === 0) &&
       (!suggestions.weakAreas || suggestions.weakAreas.length === 0) && (
        <div className="card">
          <p style={{ color: 'var(--gray)', textAlign: 'center' }}>
            No suggestions available. Add some results to get personalized recommendations!
          </p>
        </div>
      )}
    </div>
  );
};

export default ImprovementSuggestions;

