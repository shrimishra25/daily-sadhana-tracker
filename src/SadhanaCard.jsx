import { useState } from 'react'
import './App.css'

function App() {
  const [formData, setFormData] = useState({
    name: '',
    date: new Date().toISOString().split('T')[0],
    chantingRounds: 0,
    chantingEndTime: '',
    extraRounds: 0,
    studyTime: 0,
    hearingTime: 0,
    service: '',
    templeProgramAttend: '',
    mangalArti: '', // Changed to string for Yes/No dropdown
  });

  const [totalMarks, setTotalMarks] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCalculateScore = (e) => {
    e.preventDefault();
    calculateMarks(); // Call the logic here to update the 'totalMarks' state
  };

const calculateMarks = () => {
  let marks = 0;

  // 1. Chanting Logic (Max 40 Points)
  // Logic: 16 rounds = Full base marks. Time determines the percentage of those marks.
  const targetRounds = 16;
  if (Number(formData.chantingRounds) >= targetRounds) {
    if (formData.chantingEndTime) {
      const [hours, minutes] = formData.chantingEndTime.split(':').map(Number);
      const totalMinutes = hours * 60 + minutes;

      const s1 = 7 * 60 + 30;  // 07:30 AM (Full 40 pts)
      const s2 = 10 * 60;      // 10:00 AM (30 pts)
      const s3 = 12 * 60;      // 12:00 PM (20 pts)
      const s4 = 15 * 60;      // 03:00 PM (10 pts)
      const s5 = 21 * 60;      // 09:00 PM (5 pts)

      if (totalMinutes <= s1) marks += 40;
      else if (totalMinutes <= s2) marks += 30;
      else if (totalMinutes <= s3) marks += 20;
      else if (totalMinutes <= s4) marks += 10;
      else if (totalMinutes <= s5) marks += 5;
      else marks += 2; // After 9 PM
    } else {
      marks += 20; // Default if no time entered but rounds done
    }
  } else {
    // Pro-rated: 2.5 points per round if less than 16 (16 * 2.5 = 40)
    marks += (Number(formData.chantingRounds) * 2.5);
  }

  // 2. Hearing Logic (Max 20 Points)
  const hTime = Number(formData.hearingTime);
  if (hTime >= 60) marks += 20;
  else if (hTime >= 30) marks += 10;
  else if (hTime >= 15) marks += 5;

  // 3. Reading Logic (Max 20 Points)
  const rTime = Number(formData.studyTime);
  if (rTime >= 60) marks += 20;
  else if (rTime >= 30) marks += 10;
  else if (rTime >= 15) marks += 5;

  // 4. Specific Service (Max 5 Points)
  if (formData.service.trim().length > 0) {
    marks += 5;
  }

  // 5. Mangal Arti & Temple Program (Remaining 15 Points)
  // Mangal Arti: 10 pts | Temple Program: 5 pts
  if (formData.mangalArti === 'yes') marks += 10;
  if (formData.templeProgramAttend.trim().length > 0) marks += 5;

  setTotalMarks(Math.min(100, Math.round(marks))); // Cap at 100
  return marks;
};

  const handleSave = async () => {
    console.log("Saving to database:", { ...formData, totalMarks });
    alert("Data sent to backend!");
  };

  return (
    <div className="container">
      <h1>Daily Sadhana Tracker</h1>

      <div className="header-fields">
        <input type="text" name="name" placeholder="Enter Your Name" onChange={handleChange} required />
        <input
          type="text" name="date" placeholder="Select Date"
          onFocus={(e) => (e.target.type = "date")}
          onBlur={(e) => { if (!e.target.value) e.target.type = "text"; }}
          onChange={handleChange}
          required
        />
      </div>

      <table className="sadhana-table">
        <thead>
          <tr>
            <th>Activity</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Chanting Rounds</td>
            <td><input type="number" name="chantingRounds" placeholder="Daily rounds" onChange={handleChange} /></td>
          </tr>
          <tr>
            <td>Chanting End Time</td>
            <td>
              <input
                type="text" name="chantingEndTime" placeholder="Time finished"
                onFocus={(e) => (e.target.type = "time")}
                onBlur={(e) => { if (!e.target.value) e.target.type = "text"; }}
                onChange={handleChange}
              />
            </td>
          </tr>
          <tr>
            <td>Extra Rounds</td>
            <td><input type="number" name="extraRounds" placeholder="Additional rounds" onChange={handleChange} /></td>
          </tr>
          <tr>
            <td>Study Time (mins)</td>
            <td><input type="number" name="studyTime" placeholder="Minutes reading" onChange={handleChange} /></td>
          </tr>
          <tr>
            <td>Hearing Time (mins)</td>
            <td><input type="number" name="hearingTime" placeholder="Minutes listening" onChange={handleChange} /></td>
          </tr>
          <tr>
            <td>Specific Service</td>
            <td><input type="text" name="service" placeholder="Service details" onChange={handleChange} /></td>
          </tr>
          <tr>
            <td>Temple Program</td>
            <td><input type="text" name="templeProgramAttend" placeholder="Programs attended" onChange={handleChange} /></td>
          </tr>
          <tr>
            <td>Attended Mangal Arti?</td>
            <td>
              <select name="mangalArti" value={formData.mangalArti} onChange={handleChange}>
                <option value="">Select Yes/No</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>

      <div className="button-group">
        <button type="button" className="btn-secondary" onClick={handleCalculateScore}>Show Score</button>
        <button type="button" className="btn-primary" onClick={handleSave}>Save Sadhana Card</button>
      </div>

      <div className="score-card">
        <h3>Current Score: <span>{totalMarks}</span></h3>
      </div>
    </div>
  )
}

export default App
