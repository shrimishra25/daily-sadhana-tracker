import { useState, useEffect } from 'react'
import './App.css'

function App() {
    const [userName] = useState(localStorage.getItem('username') || '');
    const [userFullName] = useState(localStorage.getItem('userFullName') || '');
    const [isEditing, setIsEditing] = useState(true);
    const [hasExistingRecord, setHasExistingRecord] = useState(false);

    const [formData, setFormData] = useState({
        username: userName || '',
        name: userFullName,
        date: new Date().toISOString().split('T')[0],
        chantingRounds: '',
        chantingEndTime: '',
        extraRounds: '',
        studyTime: '',
        hearingTime: '',
        service: '',
        templeProgramAttend: '',
        mangalArti: '', // Changed to string for Yes/No dropdown
    });

  const [totalMarks, setTotalMarks] = useState(0);
  const [errors, setErrors] = useState({});

// 1. EFFECT: Check for existing data when Date changes
    useEffect(() => {
        const checkExistingRecord = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch(`http://localhost:8080/api/sadhana/byDate?date=${formData.date}&username=${userName}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data) {
                        setFormData(data);
                        setTotalMarks(data.totalMarks);
                        setHasExistingRecord(true);
                        setIsEditing(false); // LOCK the form
                    }
                } else {
                    // Reset if no record found for this new date
                    setHasExistingRecord(false);
                    setIsEditing(true); // UNLOCK the form
                    setTotalMarks(0);
                    setFormData({
                        username: localStorage.getItem('username') || '',
                        name: localStorage.getItem('userFullName') || '',
                        date: formData.date,
                        // Reset everything else to "Fresh" values
                        chantingRounds: '',
                        chantingEndTime: '',
                        extraRounds: '',
                        studyTime: '',
                        hearingTime: '',
                        service: '',
                        templeProgramAttend: '',
                        mangalArti: '',
                    });
                }
            } catch (error) {
                console.error("Lookup error:", error);
                setIsEditing(true);
            }
        };
        checkExistingRecord();
    }, [formData.date]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: false }));
      }
  };

  const handleCalculateScore = (e) => {
      let newErrors = {};
        // 1. Validation Logic
        if (!formData.name || formData.name.trim() === "") {
          newErrors.name = true;
        }
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
        alert("Please fill in the highlighted mandatory fields.");
        return;
      }
  if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: false }));
    }
    e.preventDefault();
    calculateMarks(formData); // Call the logic here to update the 'totalMarks' state
  };

const calculateMarks = (data) => {
  let marks = 0;

  // 1. Chanting Logic (Max 40 Points)
  // Logic: 16 rounds = Full base marks. Time determines the percentage of those marks.
  const targetRounds = 16;
  if (Number(data.chantingRounds) >= targetRounds) {
    if (data.chantingEndTime) {
      const [hours, minutes] = data.chantingEndTime.split(':').map(Number);
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
    marks += (Number(data.chantingRounds) * 2.5);
  }

  // 2. Hearing Logic (Max 20 Points)
  const hTime = Number(data.hearingTime);
  if (hTime >= 60) marks += 20;
  else if (hTime >= 30) marks += 10;
  else if (hTime >= 15) marks += 5;

  // 3. Reading Logic (Max 20 Points)
  const rTime = Number(data.studyTime);
  if (rTime >= 60) marks += 20;
  else if (rTime >= 30) marks += 10;
  else if (rTime >= 15) marks += 5;

  // 4. Specific Service (Max 5 Points)
  if (data.service.trim().length > 0) {
    marks += 5;
  }
  // 5. Mangal Arti & Temple Program (Remaining 15 Points)
  // Mangal Arti: 10 pts | Temple Program: 5 pts
  if (data.mangalArti === 'yes') marks += 10;
  if (data.templeProgramAttend.trim().length > 0) marks += 5;

  setTotalMarks(Math.min(100, Math.round(marks))); // Cap at 100
  return marks;
};

  const handleSave = async () => {
      const token = localStorage.getItem('token');
      const finalScore = calculateMarks(formData);
      const payload = { ...formData, totalMarks: Math.round(finalScore) }   ;

    try {
        const endpoint = hasExistingRecord
            ? 'http://localhost:8080/api/sadhana/update'
            : 'http://localhost:8080/api/sadhana/save';

        const methodType = hasExistingRecord ? 'PUT' : 'POST';
        const response = await fetch(endpoint, {
        method: methodType,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

        if (response.ok) {

            const savedData = await response.json();
            alert(hasExistingRecord
                ? "Sadhana Details updated successfully!"
                : "Sadhana Details saved successfully!");
            setFormData(savedData);
            setIsEditing(false); // LOCK form after save
            setHasExistingRecord(true);
        }
    } catch (error) {
      console.error("Detailed API Error:", error.message);
      alert("Network Error: Check the console for details.");
    }
  };

  return (
    <div className="container">
      <div className="sadhana-header">
        <h1 className="main-title">Daily Sadhana Entry</h1>
        <p className="sub-title">Please record your spiritual activities for today</p>
        <br></br>
      </div>

      <div className="header-fields">
        <input type="text" name="name" value={formData.name} /* disabled={!isEditing} */ readOnly placeholder="Enter Your Name"
            onChange={handleChange} className={errors.name ? 'input-error' : '' } />

        <input
          type="text" name="date" value={formData.date} placeholder="Select Date"
          onFocus={(e) => (e.target.type = "date")} readOnly
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
            <td><input type="number" name="chantingRounds" value={formData.chantingRounds}
            placeholder="Daily rounds" onChange={handleChange} disabled={!isEditing} /></td>
          </tr>
          <tr>
            <td>Chanting End Time</td>
            <td>
              <input
                type="text" name="chantingEndTime" value={formData.chantingEndTime} placeholder="Time finished"
                onFocus={(e) => (e.target.type = "time")}
                onBlur={(e) => { if (!e.target.value) e.target.type = "text"; }}
                onChange={handleChange} disabled={!isEditing}
              />
            </td>
          </tr>
          <tr>
            <td>Extra Rounds</td>
            <td><input type="number" name="extraRounds" placeholder="Additional rounds" onChange={handleChange} value={formData.extraRounds} disabled={!isEditing}/></td>
          </tr>
          <tr>
            <td>Study Time (mins)</td>
            <td><input type="number" name="studyTime" placeholder="Minutes reading" onChange={handleChange} value={formData.studyTime} disabled={!isEditing}/></td>
          </tr>
          <tr>
            <td>Hearing Time (mins)</td>
            <td><input type="number" name="hearingTime" placeholder="Minutes listening" value={formData.hearingTime} onChange={handleChange} disabled={!isEditing}/></td>
          </tr>
          <tr>
            <td>Specific Service</td>
            <td><input type="text" name="service" placeholder="Service details" value={formData.service} onChange={handleChange} disabled={!isEditing}/></td>
          </tr>
          <tr>
            <td>Temple Program</td>
            <td><input type="text" name="templeProgramAttend" value={formData.templeProgramAttend} placeholder="Programs attended" onChange={handleChange} disabled={!isEditing}/></td>
          </tr>
          <tr>
            <td>Attended Mangal Arti?</td>
            <td>
              <select name="mangalArti" value={formData.mangalArti} onChange={handleChange} disabled={!isEditing}>
                <option value="">Select Yes/No</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>

      <div className="button-group">
          {
              !isEditing && hasExistingRecord ? (
              <button type="button" className="btn-edit" onClick={() => setIsEditing(true)}> EDIT RECORD </button>
              ) : (<>
                <button type="button" className="btn-secondary" onClick={handleCalculateScore}>Show Score</button>
                {totalMarks > 0 && (
                    <button type="button" className="btn-primary" onClick={handleSave}> {hasExistingRecord ? 'UPDATE RECORD' : 'SAVE RECORD'} </button>
                )}
              </>
              )
          }
      </div>

      <div className="score-card">
        <h3>Current Score: <span>{totalMarks}</span></h3>
      </div>
    </div>
  )
}

export default App
