import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import '../App.css';

const ExportCGPA = ({ cgpaData, user, results }) => {
  const exportRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    if (!exportRef.current) return;

    setLoading(true);
    try {
      const canvas = await html2canvas(exportRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
      });

      const link = document.createElement('a');
      link.download = `cgpa-${user?.name || 'student'}-${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const gradeCounts = {
    A: results.filter(r => r.grade === 'A').length,
    B: results.filter(r => r.grade === 'B').length,
    C: results.filter(r => r.grade === 'C').length,
    D: results.filter(r => r.grade === 'D').length,
    E: results.filter(r => r.grade === 'E').length,
    F: results.filter(r => r.grade === 'F').length,
  };

  const currentLevel = results.length > 0
    ? Math.max(...results.map(r => r.level || r.course?.level || 0))
    : null;

  return (
    <div>
      <div className="card">
        <div className="flex-between" style={{ marginBottom: '20px' }}>
          <h2 style={{ color: 'var(--royal-blue)', margin: 0 }}>
            Export CGPA Results
          </h2>
          <button
            onClick={handleExport}
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Exporting...' : 'Export as PNG'}
          </button>
        </div>
        <p style={{ color: 'var(--gray)' }}>
          Export your CGPA results in a social media-friendly format. Click the export button to download as PNG.
        </p>
      </div>

      <div
        ref={exportRef}
        style={{
          width: '800px',
          maxWidth: '100%',
          margin: '0 auto',
          background: 'linear-gradient(135deg, #4169E1 0%, #1E3A8A 100%)',
          padding: '40px',
          borderRadius: '16px',
          color: 'var(--white)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '48px', margin: '0 0 8px 0', fontWeight: 'bold' }}>
            CGPA CHECKER
          </h1>
          <p style={{ fontSize: '20px', opacity: 0.9, margin: 0 }}>
            Academic Performance Report
          </p>
        </div>

        {/* Student Info */}
        <div style={{
          background: 'rgba(255,255,255,0.15)',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '30px'
        }}>
          <p style={{ fontSize: '18px', margin: '0 0 8px 0' }}>
            <strong>Student:</strong> {user?.name || 'Student'}
          </p>
          <p style={{ fontSize: '18px', margin: 0 }}>
            <strong>Email:</strong> {user?.email || 'N/A'}
          </p>
        </div>

        {/* CGPA Display */}
        <div style={{
          background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
          padding: '40px',
          borderRadius: '16px',
          textAlign: 'center',
          marginBottom: '30px',
          color: '#333'
        }}>
          <p style={{ fontSize: '24px', margin: '0 0 12px 0', fontWeight: '600' }}>
            Cumulative Grade Point Average
          </p>
          <p style={{ fontSize: '72px', margin: '0', fontWeight: 'bold' }}>
            {cgpaData?.overall?.cgpa?.toFixed(2) || '0.00'}
          </p>
          <p style={{ fontSize: '18px', margin: '16px 0 0 0', opacity: 0.8 }}>
            Out of 5.00
          </p>
        </div>

        {/* Statistics Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px',
          marginBottom: '30px'
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.15)',
            padding: '20px',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '32px', margin: '0 0 8px 0', fontWeight: 'bold' }}>
              {cgpaData?.results || 0}
            </p>
            <p style={{ fontSize: '14px', opacity: 0.9, margin: 0 }}>
              Total Courses
            </p>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.15)',
            padding: '20px',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '32px', margin: '0 0 8px 0', fontWeight: 'bold' }}>
              {cgpaData?.overall?.totalCreditHours || 0}
            </p>
            <p style={{ fontSize: '14px', opacity: 0.9, margin: 0 }}>
              Credit Units
            </p>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.15)',
            padding: '20px',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '32px', margin: '0 0 8px 0', fontWeight: 'bold' }}>
              {currentLevel || 'N/A'}
            </p>
            <p style={{ fontSize: '14px', opacity: 0.9, margin: 0 }}>
              Current Level
            </p>
          </div>
        </div>

        {/* Grade Distribution */}
        <div style={{
          background: 'rgba(255,255,255,0.15)',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '30px'
        }}>
          <h3 style={{ fontSize: '20px', margin: '0 0 16px 0', textAlign: 'center' }}>
            Grade Distribution
          </h3>
          <div style={{
            display: 'flex',
            justifyContent: 'space-around',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            {Object.entries(gradeCounts).map(([grade, count]) => (
              <div key={grade} style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '28px', margin: '0 0 4px 0', fontWeight: 'bold' }}>
                  {count}
                </p>
                <p style={{ fontSize: '16px', opacity: 0.9, margin: 0 }}>
                  {grade}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          paddingTop: '20px',
          borderTop: '2px solid rgba(255,255,255,0.2)'
        }}>
          <p style={{ fontSize: '14px', opacity: 0.8, margin: 0 }}>
            Generated on {new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
          <p style={{ fontSize: '12px', opacity: 0.6, margin: '8px 0 0 0' }}>
            CGPA Checker - Track Your Academic Progress
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExportCGPA;

