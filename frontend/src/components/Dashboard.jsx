import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { resultsAPI, cgpaAPI } from '../services/api';
import ResultsUpload from './ResultsUpload';
import CGPACharts from './CGPACharts';
import ImprovementSuggestions from './ImprovementSuggestions';
import CGPASimulator from './CGPASimulator';
import ExportCGPA from './ExportCGPA';
import '../App.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [results, setResults] = useState([]);
  const [cgpaData, setCgpaData] = useState(null);
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resultsRes, cgpaRes, suggestionsRes] = await Promise.all([
        resultsAPI.getAll(),
        cgpaAPI.get(),
        cgpaAPI.getSuggestions(),
      ]);
      setResults(resultsRes.data);
      setCgpaData(cgpaRes.data);
      setSuggestions(suggestionsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResultAdded = () => {
    fetchData();
  };

  const handleResultDeleted = () => {
    fetchData();
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="app">
      <header style={{
        background: 'linear-gradient(135deg, #4169E1 0%, #1E3A8A 100%)',
        color: 'var(--white)',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div className="container">
          <div className="flex-between">
            <div>
              <h1 style={{ margin: 0, fontSize: '24px' }}>CGPA Checker</h1>
              <p style={{ margin: '4px 0 0 0', opacity: 0.9 }}>
                Welcome, {user?.name}
              </p>
            </div>
            <button
              onClick={logout}
              className="btn btn-secondary"
              style={{ background: 'var(--white)', color: 'var(--royal-blue)' }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <nav style={{
        background: 'var(--white)',
        borderBottom: '2px solid var(--light-gray)',
        padding: '0 20px'
      }}>
        <div className="container">
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
            {[
              { id: 'dashboard', label: 'Dashboard' },
              { id: 'upload', label: 'Upload Results' },
              { id: 'charts', label: 'Charts' },
              { id: 'simulate', label: 'Simulate CGPA' },
              { id: 'suggestions', label: 'Improvements' },
              { id: 'export', label: 'Export' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="btn"
                style={{
                  background: activeTab === tab.id ? 'var(--royal-blue)' : 'transparent',
                  color: activeTab === tab.id ? 'var(--white)' : 'var(--dark-gray)',
                  border: 'none',
                  borderRadius: '8px 8px 0 0',
                  padding: '12px 20px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="container" style={{ marginTop: '20px' }}>
        {activeTab === 'dashboard' && (
          <div>
            <div className="card" style={{
              background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
              color: 'var(--dark-gray)',
              textAlign: 'center',
              padding: '40px'
            }}>
              <h2 style={{ fontSize: '48px', margin: 0 }}>
                {cgpaData?.overall?.cgpa?.toFixed(2) || '0.00'}
              </h2>
              <p style={{ fontSize: '20px', marginTop: '8px', fontWeight: '600' }}>
                Your Current CGPA
              </p>
              <p style={{ marginTop: '16px', opacity: 0.8 }}>
                Total Courses: {cgpaData?.results || 0} | 
                Total Credit Hours: {cgpaData?.overall?.totalCreditHours || 0}
              </p>
            </div>

            {suggestions && suggestions.suggestions.length > 0 && (
              <div className="card">
                <h3 style={{ color: 'var(--royal-blue)', marginBottom: '16px' }}>
                  Quick Suggestions
                </h3>
                {suggestions.suggestions.slice(0, 3).map((suggestion, index) => (
                  <div key={index} style={{
                    padding: '12px',
                    background: 'var(--light-gray)',
                    borderRadius: '8px',
                    marginBottom: '8px'
                  }}>
                    <strong>{suggestion.title}</strong>
                    <p style={{ margin: '4px 0 0 0', fontSize: '14px' }}>
                      {suggestion.message}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              {cgpaData?.byLevel && Object.entries(cgpaData.byLevel).map(([level, data]) => (
                <div key={level} className="card">
                  <h4 style={{ color: 'var(--gray)', marginBottom: '8px' }}>Level {level}</h4>
                  <p style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--royal-blue)', margin: 0 }}>
                    {data.cgpa.toFixed(2)}
                  </p>
                  <p style={{ fontSize: '12px', color: 'var(--gray)', marginTop: '4px' }}>
                    {data.totalCreditHours} Credit Hours
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'upload' && (
          <ResultsUpload
            results={results}
            onResultAdded={handleResultAdded}
            onResultDeleted={handleResultDeleted}
          />
        )}

        {activeTab === 'charts' && (
          <CGPACharts cgpaData={cgpaData} results={results} />
        )}

        {activeTab === 'simulate' && (
          <CGPASimulator results={results} onSimulate={fetchData} />
        )}

        {activeTab === 'suggestions' && (
          <ImprovementSuggestions suggestions={suggestions} />
        )}

        {activeTab === 'export' && (
          <ExportCGPA cgpaData={cgpaData} user={user} results={results} />
        )}
      </main>
    </div>
  );
};

export default Dashboard;

