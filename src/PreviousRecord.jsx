import React, { useState, useEffect } from 'react';

const PreviousRecord = ({ refresh }) => {
  const [recentRecords, setRecentRecords] = useState([]);

  useEffect(() => {
    // Replace with your actual backend URL
    fetch('http://localhost:8080/api/sadhana/recent')
      .then(res => res.json())
      .then(data => setRecentRecords(data))
      .catch(err => console.error("Data fetch error:", err));
  }, [refresh]);

  return (
    <div style={{ marginTop: '30px', padding: '20px', width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      <h3 style={{ textAlign: 'center', color: '#4A4A4A', marginBottom: '15px' }}>Recent 3 Days History</h3>

      <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2', borderBottom: '2px solid #ddd' }}>
            <th style={styles.th}>Date</th>
            <th style={styles.th}>Japa Rounds</th>
            <th style={styles.th}>Reading (mins)</th>
            <th style={styles.th}>Status</th>
          </tr>
        </thead>
        <tbody>
          {recentRecords.length > 0 ? (
            recentRecords.map((record, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                <td style={styles.td}>{record.date}</td>
                <td style={styles.td}>{record.japaRounds}</td>
                <td style={styles.td}>{record.readingTime}</td>
                <td style={styles.td}>{record.completed ? '✅' : '❌'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ padding: '20px', textAlign: 'center', color: '#888' }}>
                No records found for the last 3 days.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  th: { padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' },
  td: { padding: '12px', textAlign: 'left' }
};

export default PreviousRecord;