//Quiz

import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Quiz() {
    const [questions, setQuestions] = useState([]);
    const [selections, setSelections] = useState({}); // { questionId: selectedIndex }
    const [userData, setUserData] = useState({ name: '', email: '' });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch questions from the backend
        axios.get('http://localhost:5000/api/questions')
            .then(res => {
                setQuestions(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error loading questions", err);
                setLoading(false);
            });
    }, []);

    const handleRadioChange = (qId, optionIndex) => {
        setSelections({ ...selections, [qId]: optionIndex });
    };

    const handleUserInfoChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!userData.name || !userData.email) {
            alert("Please provide your name and email!");
            return;
        }

        // Convert selections object into the format the server expects
        const userAnswers = Object.keys(selections).map(qId => ({
            qId: qId,
            choice: selections[qId]
        }));

        try {
            const response = await axios.post('http://localhost:5000/api/submit', {
                name: userData.name,
                email: userData.email,
                userAnswers
            });
            setResult(response.data);
        } catch (err) {
            console.error("Submission failed", err);
            alert("There was an error submitting your quiz.");
        }
    };

    if (loading) return <div>Loading questions...</div>;

    if (result) return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h2>Great job, {result.username}!</h2>
            <p style={{ fontSize: '24px' }}>
                Your Score: <strong>{result.score} / {result.total}</strong>
            </p>
            <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
    );

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <h1>Pop Quiz</h1>

            {/* User Info Section */}
            <div style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ddd' }}>
                <h3>Enter your details:</h3>
                <input 
                    style={{ display: 'block', marginBottom: '10px', width: '100%', padding: '8px' }}
                    type="text" 
                    name="name" 
                    placeholder="Full Name" 
                    value={userData.name}
                    onChange={handleUserInfoChange}
                />
                <input 
                    style={{ display: 'block', width: '100%', padding: '8px' }}
                    type="email" 
                    name="email" 
                    placeholder="Email Address" 
                    value={userData.email}
                    onChange={handleUserInfoChange}
                />
            </div>

            <hr />

            {/* Questions Section */}
            {questions.map((q) => (
                <div key={q._id} style={{ marginBottom: '25px' }}>
                    <h3>{q.questionText}</h3>
                    {q.options.map((opt, index) => (
                        <label key={index} style={{ display: 'block', marginBottom: '5px', cursor: 'pointer' }}>
                            <input 
                                type="radio" 
                                name={q._id} 
                                checked={selections[q._id] === index}
                                onChange={() => handleRadioChange(q._id, index)} 
                            />
                            {opt}
                        </label>
                    ))}
                </div>
            ))}

            <button 
                onClick={handleSubmit}
                style={{ 
                    padding: '10px 20px', 
                    backgroundColor: '#007bff', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '5px',
                    cursor: 'pointer'
                }}
            >
                Submit Quiz
            </button>
        </div>
    );
}

export default Quiz;