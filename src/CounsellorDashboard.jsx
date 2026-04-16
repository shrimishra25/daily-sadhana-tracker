import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CounsellorDashboard = () => {
    const navigate = useNavigate(); // Define this
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const counsellorId = localStorage.getItem('username');

    useEffect(() => {
        const fetchTeamReport = async () => {
            const token = localStorage.getItem('token');
            const role = localStorage.getItem('userRole');
            if (role !== 'COUNSELLOR') {
                alert("Access Denied: You do not have Counsellor privileges.");
                navigate('/dashboard');
            }
            try {
                // This API endpoint will fetch records of all sadhaks tagged to this counsellor
                const response = await fetch(`http://localhost:8080/api/sadhana/counsellor/report?counsellorName=${counsellorId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    const data = await response.json();
                    setReports(data);
                }
            } catch (error) {
                console.error("Error fetching team reports:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTeamReport();
    }, [counsellorId]);

    if (loading) return <div className="container">Loading Team Data...</div>;

    const filteredReports = reports.filter(report =>
        report.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container" style={{ maxWidth: '1000px' }}>
            <h1 style={{ color: '#5C6BC0' }}>Counsellor Dashboard</h1>
            <p>Monitoring reports for tagged Sadhaks</p>

            <div className="report-summary" style={styles.summaryGrid}>
                <div style={styles.statCard}>
                    <h4>Total Sadhaks</h4>
                    <p style={styles.statNumber}>{reports.length}</p>
                </div>
                <div style={styles.statCard}>
                    <h4>Active Today</h4>
                    <p style={styles.statNumber}>
                        {reports.filter(r => r.date === new Date().toISOString().split('T')[0]).length}
                    </p>
                </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <input
                  type="text"
                  placeholder="🔍 Search Sadhak by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={styles.searchInput} // We'll define this below
                />
            </div>

            <table className="sadhana-table" style={{ marginTop: '20px' }}>
                <thead>
                    <tr>
                        <th>Sadhak Name</th>
                        <th>Date</th>
                        <th>Rounds</th>
                        <th>Reading</th>
                        <th>Score</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredReports.length > 0 ? (
                        filteredReports.map((report, index) => (
                            <tr key={index} style={report.totalMarks < 40 ? {backgroundColor: '#FFF9C4'} : {}}>
                                <td><strong>{report.name}</strong></td>
                                <td>{report.date}</td>
                                <td>{report.chantingRounds}</td>
                                <td>{report.studyTime} mins</td>
                                <td>{report.totalMarks}</td>
                                <td>{report.totalMarks >= 35 ? '✅' : '⚠️'}</td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan="6">No records found for your counselees.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

const styles = {
    summaryGrid: { display: 'flex', gap: '20px', marginBottom: '20px' },
    statCard: { flex: 1, padding: '15px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', textAlign: 'center' },
    statNumber: { fontSize: '24px', fontWeight: 'bold', color: '#5C6BC0', margin: '5px 0' },
    searchInput: {
        width: '100%',
        maxWidth: '400px',
        padding: '12px 20px',
        borderRadius: '12px',
        border: '1px solid #E2E8F0',
        fontSize: '15px',
        outline: 'none',
        boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
        fontFamily: "'Segoe UI', sans-serif"
      }
};

export default CounsellorDashboard;