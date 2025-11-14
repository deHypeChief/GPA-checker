import { useMemo } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import '../App.css';

const COLORS = ['#4169E1', '#FFD700', '#808080', '#FFA500', '#28a745', '#dc3545'];

const CGPACharts = ({ cgpaData, results }) => {
  const chartData = useMemo(() => {
    if (!cgpaData?.bySemester) return [];

    return Object.entries(cgpaData.bySemester)
      .map(([semester, data]) => ({
        semester,
        cgpa: data.cgpa,
      }))
      .sort((a, b) => a.semester.localeCompare(b.semester));
  }, [cgpaData]);

  const gradeDistribution = useMemo(() => {
    const distribution = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 };
    results.forEach(result => {
      if (distribution[result.grade] !== undefined) {
        distribution[result.grade]++;
      }
    });
    return Object.entries(distribution).map(([grade, count]) => ({
      name: grade,
      value: count,
    }));
  }, [results]);

  const levelData = useMemo(() => {
    if (!cgpaData?.byLevel) return [];
    return Object.entries(cgpaData.byLevel).map(([level, data]) => ({
      level: `Level ${level}`,
      cgpa: data.cgpa,
    })).sort((a, b) => a.level.localeCompare(b.level));
  }, [cgpaData]);

  return (
    <div>
      <h2 style={{ color: 'var(--royal-blue)', marginBottom: '24px' }}>
        CGPA Analytics & Charts
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
        {/* CGPA Trend Chart */}
        {chartData.length > 0 && (
          <div className="card">
            <h3 style={{ color: 'var(--royal-blue)', marginBottom: '20px' }}>
              CGPA Trend by Semester
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="semester" angle={-45} textAnchor="end" height={80} />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="cgpa"
                  stroke="#4169E1"
                  strokeWidth={3}
                  name="CGPA"
                  dot={{ fill: '#FFD700', r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* CGPA by Level */}
        {levelData.length > 0 && (
          <div className="card">
            <h3 style={{ color: 'var(--royal-blue)', marginBottom: '20px' }}>
              CGPA by Level
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={levelData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="level" />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="cgpa" fill="#4169E1" name="CGPA" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Grade Distribution */}
        {gradeDistribution.some(g => g.value > 0) && (
          <div className="card">
            <h3 style={{ color: 'var(--royal-blue)', marginBottom: '20px' }}>
              Grade Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={gradeDistribution.filter(g => g.value > 0)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {gradeDistribution.filter(g => g.value > 0).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Performance Summary */}
        <div className="card">
          <h3 style={{ color: 'var(--royal-blue)', marginBottom: '20px' }}>
            Performance Summary
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            <div style={{
              padding: '16px',
              background: 'var(--light-gray)',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--royal-blue)', margin: 0 }}>
                {cgpaData?.overall?.cgpa?.toFixed(2) || '0.00'}
              </p>
              <p style={{ color: 'var(--gray)', marginTop: '4px' }}>Overall CGPA</p>
            </div>
            <div style={{
              padding: '16px',
              background: 'var(--light-gray)',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#28a745', margin: 0 }}>
                {results.filter(r => r.grade === 'A').length}
              </p>
              <p style={{ color: 'var(--gray)', marginTop: '4px' }}>A Grades</p>
            </div>
            <div style={{
              padding: '16px',
              background: 'var(--light-gray)',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#ffc107', margin: 0 }}>
                {results.filter(r => ['C', 'D', 'E', 'F'].includes(r.grade)).length}
              </p>
              <p style={{ color: 'var(--gray)', marginTop: '4px' }}>Need Improvement</p>
            </div>
            <div style={{
              padding: '16px',
              background: 'var(--light-gray)',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--royal-blue)', margin: 0 }}>
                {cgpaData?.overall?.totalCreditHours || 0}
              </p>
              <p style={{ color: 'var(--gray)', marginTop: '4px' }}>Credit Hours</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CGPACharts;

