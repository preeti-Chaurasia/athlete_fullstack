import React, { useState, useCallback } from 'react';
import './Nutrition.css';
import { useNavigate } from "react-router-dom";
import { FiHome, FiCpu, FiCoffee, FiUser, FiSearch, FiBell, FiSettings, FiCheckCircle, FiAlertCircle, FiZap, FiPlus, FiActivity, FiAward, FiTarget, FiLogOut } from 'react-icons/fi';
import { BiTargetLock, BiLeaf } from 'react-icons/bi';
import { MdOutlineSetMeal } from 'react-icons/md';
import axios from 'axios';
// NOTE: The API key is exposed here for demonstration purposes only. In production, this should be securely stored and accessed via a backend service to prevent misuse. 

const API_BASE_URL = "https://athlete-os-lixf.onrender.com"; 
// Agar tum local backend chala rahi ho toh ise "http://localhost:5000" karo
// ✅ Frontend ka naya function

export default function Nutrition() {
  const [active, setActive] = useState("nutrition");
  const [goal, setGoal] = useState('Build Muscle');
  const [diet, setDiet] = useState('Veg');
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [dietPlan, setDietPlan] = useState(null);
  const [error, setError] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    navigate("/");
  };

  const fetchDietPlan = useCallback(async () => {
  // Prevent spam clicking (10 seconds cooldown)
  const lastCall = localStorage.getItem('lastDietCall');
  const now = Date.now();
  if (lastCall && now - parseInt(lastCall) < 10000) {
    setError('Please wait 10 seconds before generating again.');
    return;
  }
  localStorage.setItem('lastDietCall', now.toString());

  setLoading(true);
  setError(null);

  try {
    // ✅ Backend ko call kar rahe hain
    // Purana { ... } hatao aur ye dalo
// ❌ Purana galat code:
// const response = await axios.post("http://localhost:5000/api/nutrition/diet-plan", { ... });

// ✅ Naya sahi code (Jo Render URL use karega):
const API_URL = process.env.REACT_APP_API_URL || "https://athlete-os-lixf.onrender.com";
const response = await axios.post(`${API_URL}/api/nutrition/diet-plan`, {
    goal: goal,
    diet: diet,
    sport: "Cricket"
});
    if (response.data.success) {
      setDietPlan(response.data.plan);
    } else {
      throw new Error("Backend failed to generate plan");
    }

  } catch (err) {
    console.error('Diet plan error:', err);
    // Agar Backend se error aaye toh message dikhao
    setError(err.response?.data?.error || err.message);
  } finally {
    setLoading(false);
  }
}, [goal, diet]);


  const microStatusColor = (status) => {
    if (status === 'OPTIMAL') return { text: 'text-green', bar: 'bg-green' };
    if (status === 'GOOD') return { text: 'text-cyan', bar: 'bg-cyan-bar' };
    if (status === 'LOW') return { text: 'text-muted', bar: 'bg-muted-bar' };
    if (status === 'CRITICAL') return { text: 'text-red', bar: 'bg-red' };
    return { text: 'text-muted', bar: 'bg-muted-bar' };
  };

  const currentStats = dietPlan?.macros || { cals: '—', protein: '—g', carbs: '—g', fats: '—g', width: '0%' };
  const currentMeals = dietPlan?.meals || [];
  const aiInsight = dietPlan?.aiInsight || '';
  const supplements = dietPlan?.supplements || [];
  const micronutrients = dietPlan?.micronutrients || [];
// 
  return (
    <div className="dashboard-container">
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

      <main className="main-content">
        <header className="top-bar">
          <div className="search-bar">
            <FiSearch className="search-icon" />
            <input type="text" placeholder="Search foods or macros..." />
          </div>
          <div className="top-actions">
            <FiBell className="icon" />
            <FiSettings className="icon" />
            <span className="system-status text-muted">CURRENT PHASE: <span className="text-cyan font-bold" style={{marginLeft: '6px'}}>HYPERTROPHY II</span></span>
          </div>
        </header>

        <div className="nutrition-grid">

          {/* LEFT COLUMN */}
          <div className="nutri-left-col">
            <div className="card">
              <h3 className="card-title-small"><BiTargetLock className="text-cyan" size={18}/> PERFORMANCE GOAL</h3>
              <div className="interactive-btn-group">
                <button className={`inter-btn ${goal === 'Build Muscle' ? 'active-cyan' : ''}`} onClick={() => setGoal('Build Muscle')} disabled={loading}>Build Muscle <FiZap /></button>
                <button className={`inter-btn ${goal === 'Stamina' ? 'active-cyan' : ''}`} onClick={() => setGoal('Stamina')} disabled={loading}>Stamina</button>
                <button className={`inter-btn ${goal === 'Cut Weight' ? 'active-cyan' : ''}`} onClick={() => setGoal('Cut Weight')} disabled={loading}>Cut Weight</button>
              </div>
            </div>

            <div className="card">
              <h3 className="card-title-small"><BiLeaf className="text-green" size={18}/> DIETARY TYPE</h3>
              <div className="diet-toggle-box">
                <div className={`diet-box ${diet === 'Veg' ? 'active-veg' : ''}`} onClick={() => !loading && setDiet('Veg')}>
                  <BiLeaf size={24} /><span>VEG</span>
                </div>
                <div className={`diet-box ${diet === 'Non-Veg' ? 'active-nonveg' : ''}`} onClick={() => !loading && setDiet('Non-Veg')}>
                  <MdOutlineSetMeal size={24} /><span>NON-VEG</span>
                </div>
              </div>
            </div>

            <div className="card">
              <p className="text-muted" style={{fontSize: '10px', letterSpacing: '1px', marginBottom: '8px'}}>
                {loading ? 'AI GENERATING...' : 'AI POWERED • REAL-TIME'}
              </p>
              <h3 className="card-title-small" style={{marginBottom: '10px'}}>METABOLIC RATE</h3>
              {loading ? (
                <div className="ai-loading-state">
                  <div className="ai-spinner"></div>
                  <p className="text-muted" style={{fontSize: '12px', marginTop: '10px'}}>Generating your plan...</p>
                </div>
              ) : (
                <>
                  <h1 className="text-cyan" style={{fontSize: '36px', transition: '0.3s'}}>
                    {currentStats.cals} <span style={{fontSize: '14px', color: '#8a93a6'}}>kcal/day</span>
                  </h1>
                  <div className="progress-bar-container" style={{marginTop: '15px'}}>
                    <div className="progress-bar-fill" style={{width: currentStats.width, transition: 'width 0.5s ease'}}></div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* CENTER COLUMN */}
          <div className="nutri-center-col">
            <div className="macros-row">
              <div className="macro-box border-top-cyan">
                <p>PROTEIN</p><h2>{loading ? '—' : currentStats.protein}</h2>
                <div className="macro-line line-cyan"></div>
              </div>
              <div className="macro-box border-top-green">
                <p>CARBS</p><h2>{loading ? '—' : currentStats.carbs}</h2>
                <div className="macro-line line-green"></div>
              </div>
              <div className="macro-box border-top-red">
                <p>FATS</p><h2>{loading ? '—' : currentStats.fats}</h2>
                <div className="macro-line line-red"></div>
              </div>
            </div>

            <div className="fuel-plan-header">
            <h2>Daily Fuel Plan</h2>
            <button className="btn-outline-cyan" onClick={fetchDietPlan} disabled={loading}
    style={{fontSize:'11px', padding:'8px 16px'}}>
    {loading ? 'GENERATING...' : '⚡ GENERATE PLAN'}
  </button>
</div>
            {error && !loading && (
              <div className="card" style={{borderColor: '#ff5252', textAlign: 'center', padding: '24px'}}>
                <FiAlertCircle className="text-red" size={32} style={{marginBottom: '12px'}} />
                <p className="text-red" style={{fontSize: '13px', marginBottom: '8px'}}>Failed to load AI diet plan</p>
                <p className="text-muted" style={{fontSize: '11px', marginBottom: '16px'}}>{error}</p>
                <button className="btn-outline-cyan" onClick={fetchDietPlan}>RETRY</button>
              </div>
            )}

            {loading && (
              <div className="meal-list">
                {[1,2,3].map(i => (
                  <div className="meal-card border-left-cyan" key={i} style={{opacity: 0.4}}>
                    <div className="meal-img-box" style={{background: '#2a2e39'}}></div>
                    <div className="meal-info" style={{flex: 1}}>
                      <div style={{height: '10px', background: '#2a2e39', borderRadius: '4px', width: '60%', marginBottom: '10px'}}></div>
                      <div style={{height: '16px', background: '#2a2e39', borderRadius: '4px', width: '80%', marginBottom: '8px'}}></div>
                      <div style={{height: '10px', background: '#2a2e39', borderRadius: '4px', width: '90%'}}></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && !error && (
              <div className="meal-list">
                {currentMeals.map((meal, index) => (
                  <div className={`meal-card border-left-${meal.color}`} key={index}>
                    <div className="meal-img-ai" style={{
                      background: meal.color === 'cyan' ? 'linear-gradient(135deg,#00e5ff22,#00e5ff44)' : meal.color === 'green' ? 'linear-gradient(135deg,#00e67622,#00e67644)' : 'linear-gradient(135deg,#ff525222,#ff525244)',
                      minWidth: '80px', height: '80px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <span style={{fontSize: '22px'}}>
                        {meal.timeSlot === 'pre-workout' ? '⚡' : meal.timeSlot === 'breakfast' ? '🌅' : meal.timeSlot === 'lunch' ? '🍽️' : meal.timeSlot === 'snack' ? '🥗' : '🌙'}
                      </span>
                    </div>
                    <div className="meal-info">
                      <div className="meal-time-row">
                        <span className={`text-${meal.color} meal-time`}>{meal.time}</span>
                        <span className="meal-cals">{meal.cals} <br/><small>KCAL</small></span>
                      </div>
                      <h3>{meal.title}</h3>
                      <p>{meal.desc}</p>
                      <div className="meal-tags">{meal.tags.map((tag, i) => <span key={i}>{tag}</span>)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN */}
          <div className="nutri-right-col">
            <div className="card">
              <h3 style={{marginBottom: '20px', fontSize: '16px'}}>Micronutrient Radar</h3>
              {loading ? (
                <div style={{opacity: 0.4}}>
                  {[1,2,3,4].map(i => (
                    <div className="micro-item" key={i}>
                      <div className="micro-icon bg-cyan-light"></div>
                      <div className="micro-details" style={{flex:1}}>
                        <div style={{height:'10px', background:'#2a2e39', borderRadius:'4px', marginBottom:'8px'}}></div>
                        <div className="micro-bar-bg"><div className="micro-bar-fill" style={{width:'30%', background:'#2a2e39'}}></div></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                micronutrients.map((micro, i) => {
                  const colors = microStatusColor(micro.status);
                  return (
                    <div className="micro-item" key={i}>
                      <div className={`micro-icon ${micro.status === 'CRITICAL' || micro.status === 'LOW' ? 'bg-red-light' : 'bg-cyan-light'}`}>
                        {micro.status === 'CRITICAL' || micro.status === 'LOW' ? <FiAlertCircle className={colors.text}/> : <FiCheckCircle className={colors.text}/>}
                      </div>
                      <div className="micro-details">
                        <div className="micro-text"><span>{micro.name}</span><span className={colors.text}>{micro.status}</span></div>
                        <div className="micro-bar-bg">
                          <div className="micro-bar-fill" style={{
                            width: `${micro.level}%`,
                            background: micro.status === 'OPTIMAL' ? 'var(--green)' : micro.status === 'GOOD' ? 'var(--cyan)' : micro.status === 'LOW' ? '#8a93a6' : 'var(--red)'
                          }}></div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="card ai-insight-card">
              <h3 className="card-title-small"><span className="text-cyan">✦ ATHLETE OS AI</span></h3>
              {loading ? (
                <div style={{opacity: 0.5}}>
                  <div style={{height:'10px', background:'#2a2e39', borderRadius:'4px', marginBottom:'8px'}}></div>
                  <div style={{height:'10px', background:'#2a2e39', borderRadius:'4px', width:'80%', marginBottom:'8px'}}></div>
                  <div style={{height:'10px', background:'#2a2e39', borderRadius:'4px', width:'60%'}}></div>
                </div>
              ) : (
                <p className="ai-quote">"{aiInsight}"</p>
              )}
              <button className="btn-outline-cyan" onClick={fetchDietPlan} disabled={loading}>
                {loading ? 'GENERATING...' : 'REGENERATE PLAN'}
              </button>
            </div>

            <div className="card">
              <h3 style={{marginBottom: '16px', fontSize: '16px'}}>Supplement Stack</h3>
              <ul className="supp-list">
                {loading ? (
                  [1,2,3].map(i => (
                    <li key={i} style={{opacity: 0.4}}>
                      <div style={{height:'10px', background:'#2a2e39', borderRadius:'4px', width:'80%'}}></div>
                    </li>
                  ))
                ) : (
                  supplements.map((supp, i) => (
                    <li key={i}><FiCheckCircle className="text-cyan"/> {supp}</li>
                  ))
                )}
              </ul>
            </div>

            <div className="fab-button"><FiPlus size={28} /></div>
          </div>
        </div>
      </main>
    </div>
  );
}