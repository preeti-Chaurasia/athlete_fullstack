import React, { useState, useEffect } from "react";
import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";
import "./VoiceInjuryPrediction.css";
import { useNavigate } from "react-router-dom";
import { FiHome, FiCpu, FiCoffee, FiUser, FiSearch, FiBell, FiSettings, FiCheckCircle, FiAlertCircle, FiZap, FiPlus, FiActivity, FiAward, FiTarget, FiLogOut } from 'react-icons/fi';


export default function VoiceInjuryAI() {

  const [active, setActive] = useState("injury");
  const [baselineData, setBaselineData] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [result, setResult] = useState(null);
  const [listening, setListening] = useState(false);
  const [started, setStarted] = useState(false);
  const [history, setHistory] = useState([]);
   const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    navigate("/");
  };
  const navigate = useNavigate();
  
  const questions = [
  "How many hours did you sleep last night?",
  "Rate your training load today from 1 to 10.",
  "Rate your mental stress today from 1 to 10.",
  "Rate your fatigue level today from 1 to 10.",
  "THANK YOU FOR ANSWERING"
];

  // 🔹 Fetch baseline
 useEffect(() => {
  // 1. API_URL ko environment variable se uthao ya default Render link dalo
  const API_URL = process.env.REACT_APP_API_URL || "https://athlete-os-lixf.onrender.com";

  // 2. Localhost hata kar dynamic URL use karo
  fetch(`${API_URL}/api/athlete-baseline/1`)
    .then(res => {
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    })
    .then(data => setBaselineData(data))
    .catch(err => console.error("Dharmi, baseline fetch error:", err));
}, []);

  // 🔹 Speak Question
 const speakQuestion = (text) => {
  return new Promise((resolve) => {
    // 🚨 Yahan "REACT_APP_" lagana zaroori hai
    const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(
      process.env.REACT_APP_AZURE_SPEECH_KEY, 
      process.env.REACT_APP_AZURE_SPEECH_REGION
    );

    const synthesizer = new SpeechSDK.SpeechSynthesizer(speechConfig);
    synthesizer.speakTextAsync(
      text,
      () => { synthesizer.close(); resolve(); },
      () => { synthesizer.close(); resolve(); }
    );
  });
};

  // 🔹 Record Answer
  const recordAnswer = (questionIndex) => {
  return new Promise((resolve) => {
    setListening(true);

    // 🚨 Yahan bhi "REACT_APP_" lagana zaroori hai
    const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(
      process.env.REACT_APP_AZURE_SPEECH_KEY, 
      process.env.REACT_APP_AZURE_SPEECH_REGION
    );

    speechConfig.speechRecognitionLanguage = "en-US";
    const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
    const recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);
    let finalText = "";

    recognizer.recognizing = (s, e) => {
      finalText = e.result.text;
    };

    recognizer.recognized = (s, e) => {
      if (e.result.reason === SpeechSDK.ResultReason.RecognizedSpeech) {
        finalText = e.result.text;
      }
    };

    recognizer.startContinuousRecognitionAsync();

    // 🔥 Listen minimum 4 seconds
    setTimeout(() => {
      recognizer.stopContinuousRecognitionAsync(() => {

        recognizer.close();
        setListening(false);

        if (!finalText || finalText.trim() === "") {

          // ❌ No answer → Repeat question
          speakQuestion("I did not hear you. Please answer again.")
            .then(() => {
              recordAnswer(questionIndex).then(resolve);
            });

        } else {

          setAnswers(prev => {
            const updated = [...prev];
            updated[questionIndex] = finalText;
            return updated;
          });

          resolve(finalText);
        }

      });
    }, 4000); // 4 seconds listening

  });
};
  // 🔥 MAIN FLOW CONTROLLER
const startSystem = async () => {

  setStarted(true);
  setLoading(true);
  setAnswers([]);
  setResult(null);

  const collectedAnswers = [];  // 🔥 LOCAL ARRAY

  for (let i = 0; i < questions.length; i++) {

    setCurrentQ(i);

    await speakQuestion(questions[i]);

    const answer = await recordAnswer(i);

    collectedAnswers[i] = answer;   // 🔥 store locally

    await new Promise(r => setTimeout(r, 1000));
  }

  await runPrediction(collectedAnswers);
setLoading(false);  // 🔥 PASS DATA DIRECTLY
};
  
  const extractNumber = (text) => {
  const num = text?.match(/\d+/);
  return num ? parseInt(num[0]) : 0;
};
  // 🔹 Run Prediction
  // 🔹 Run Prediction (Updated for Live Website)
const runPrediction = async (answersData) => {
  // Sabse pehle API_URL define karo (agar upar nahi kiya hai toh)
  const API_URL = process.env.REACT_APP_API_URL || "https://athlete-os-lixf.onrender.com";

  const sleep = extractNumber(answersData[0]);
  const load = extractNumber(answersData[1]);
  const stress = extractNumber(answersData[2]);
  const fatigue = extractNumber(answersData[3]);

  try {
    // 🚨 Yahan localhost hata kar `${API_URL}` use kiya hai
    const res = await fetch(`${API_URL}/api`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        athleteId: 1,
        sleep: Number(sleep),
        load: Number(load),
        stress: Number(stress),
        fatigue: Number(fatigue)
      })
    });

    const data = await res.json();
    setResult(data);

    // 🔥 Fetch Updated History (Yahan bhi localhost hata diya)
    const historyRes = await fetch(`${API_URL}/api/history/1`);
    const historyData = await historyRes.json();
    setHistory(historyData);
    
  } catch (err) {
    console.error("Prediction Error:", err);
    alert("Backend connection failed! Make sure Render is awake.");
  }
};
  return (
  <div className="dashboard-container">

    {/* SIDEBAR */}
    <aside className="sidebar">
            <div className="logo-section">
              <h2>ATHLETE OS</h2>
              <span>ELITE PERFORMANCE</span>
            </div>
            <nav className="side-nav">
              <div className={`nav-item ${active === "dash" ? "active" : ""}`} onClick={() => { setActive("dash"); navigate("/dashboard"); }}><FiHome /> Dashboard</div>
              <div className={`nav-item ${active === "aicoach" ? "active" : ""}`} onClick={() => { setActive("aicoach"); navigate("/aicoach"); }}><FiCpu /> AI Coach</div>
              <div className={`nav-item ${active === "nutrition" ? "active" : ""}`} onClick={() => { setActive("nutrition"); navigate("/nutrition"); }}><FiCoffee /> Nutrition</div>
              <div className={`nav-item ${active === "injury" ? "active" : ""}`} onClick={() => { setActive("injury"); navigate("/injury"); }}><FiActivity /> Injury</div>
              <div className={`nav-item ${active === "ranking" ? "active" : ""}`} onClick={() => { setActive("ranking"); navigate("/ranking"); }}><FiAward /> Ranking</div>
              <div className={`nav-item ${active === "opportunities" ? "active" : ""}`} onClick={() => { setActive("opportunities"); navigate("/opportunities"); }}><FiTarget /> Opportunities</div>
              <div className={`nav-item ${active === "profile" ? "active" : ""}`} onClick={() => { setActive("profile"); navigate("/profile"); }}><FiUser /> Profile</div>
              <div className="nav-item logout" onClick={handleLogout} style={{ marginTop: 'auto', color: '#ff5252', cursor: 'pointer' }}><FiLogOut /> Logout</div>
            </nav>
            <div className="user-profile-mini">
              <div className="avatar"></div>
              <div className="user-info">
                <h4>Arjun Singh</h4>
                <p>Pro Athlete</p>
              </div>
            </div>
          </aside>
    

    {/* MAIN CONTENT */}
    <div className="main-content">
      <div className="voice-ai-page">

        <div className="voice-ai-layout">

          {/* LEFT SIDE */}
          <div className="left-panel">

            <h2>🎙️ AI Voice Injury Prediction</h2>

            {!started && (
             <button onClick={startSystem} disabled={loading}>
  {loading ? "Processing..." : "START"}
</button>
            )}

            {started && (
              <div className="question-card">
                <h3>Question {currentQ + 1}</h3>
                <p>{questions[currentQ]}</p>
                {listening && <p>🎙 Listening...</p>}
              </div>
            )}

            {answers.length > 0 && (
              <div className="answers-section">
                <h3>📝 Your Answers</h3>
                {answers.map((ans, i) => (
                  <div key={i} className="answer-box">
                    <strong>Q{i + 1}:</strong> {questions[i]}
                    <p><strong>Answer:</strong> {ans}</p>
                  </div>
                ))}
              </div>
            )}

          </div>

          {/* RIGHT SIDE */}
          <div className="right-panel">

            {baselineData && (
              <div className="baseline-card">
                <h3>📊 Existing Athlete Data</h3>
                <p>Weekly Avg Load: {baselineData.weeklyLoad}</p>
                <p>HRV: {baselineData.hrv}</p>
                <p>Sleep Avg: {baselineData.sleepAvg}</p>
                <p>Recovery Index: {baselineData.recoveryScore}</p>
              </div>
            )}

            {result && (
              <div className="result-panel">
                <h3>🔥 Injury Risk Score: {result.injuryScore}</h3>
                <h4>⚠ Risk Level: {result.riskLevel}</h4>
                <p style={{ whiteSpace: "pre-line" }}>
                  <strong>AI Advice:</strong> {result.advice}
                </p>
              </div>
            )}

          </div>

        </div>

        {/* HISTORY FULL WIDTH */}
        {history.length > 0 && (
          <div className="history-table">
            <h3>📋 Injury History</h3>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Sleep</th>
                  <th>Load</th>
                  <th>Stress</th>
                  <th>Fatigue</th>
                  <th>Score</th>
                  <th>Risk</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item, index) => (
                  <tr key={index}>
                    <td>{new Date(item.created_at).toLocaleDateString()}</td>
                    <td>{item.sleep}</td>
                    <td>{item.load}</td>
                    <td>{item.stress}</td>
                    <td>{item.fatigue}</td>
                    <td>{item.injury_score}</td>
                    <td className={
                      item.risk_level === "High"
                        ? "high-risk"
                        : item.risk_level === "Moderate"
                        ? "moderate-risk"
                        : "low-risk"
                    }>
                      {item.risk_level}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>

  </div>
);
}