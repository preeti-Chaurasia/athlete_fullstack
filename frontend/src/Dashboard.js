import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { useNavigate } from "react-router-dom";
import { FiHome, FiCpu, FiCoffee, FiUser, FiSearch, FiBell, FiSettings, FiActivity, FiAward, FiTarget, FiLogOut, FiTrendingUp, FiChevronDown } from 'react-icons/fi';
import { BiTrendingUp } from 'react-icons/bi';

export default function Dashboard() {
  const [userName, setUserName] = useState('Athlete');
  const [active, setActive] = useState("dash");
  const navigate = useNavigate();

const handleLogout = () => {
  // 🔥 localStorage clear
  localStorage.removeItem("userId");

  // (optional) sab clear karna ho to:
  // localStorage.clear();

  // 🔥 redirect to login page
  navigate("/");
};

  useEffect(() => {
    // Yahan hum local storage se logged-in user ka naam nikal rahe hain.
    // Agar DB se fetch kar rahe hain, toh response.data.name set kar sakte hain.
    const storedName = localStorage.getItem('userName'); 
    if (storedName) {
      // First name extract karne ke liye (e.g., "Arjun Singh" -> "Arjun")
      setUserName(storedName.split(' ')[0]); 
    }
  }, []);

  // Contribution graph ke liye dummy array
  const renderHeatmap = () => {
    let squares = [];
    for (let i = 0; i < 180; i++) {
      const activeLevel = Math.floor(Math.random() * 4); // 0 to 3
      squares.push(<div key={i} className={`heat-square level-${activeLevel}`}></div>);
    }
    return squares;
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
                
                <div className={`nav-item ${active === "dash" ? "active" : ""}`} onClick={() => { setActive("dash"); navigate("/dashboard"); }}>
                  <FiHome /> Dashboard
                </div>
      
                <div className={`nav-item ${active === "aicoach" ? "active" : ""}`} onClick={() => { setActive("aicoach"); navigate("/aicoach"); }}>
                  <FiCpu /> AI Coach
                </div>
      
                <div className={`nav-item ${active === "nutrition" ? "active" : ""}`} onClick={() => { setActive("nutrition"); navigate("/nutrition"); }}>
                  <FiCoffee /> Nutrition
                </div>
      
                <div className={`nav-item ${active === "injury" ? "active" : ""}`} onClick={() => { setActive("injury"); navigate("/injury"); }}>
                  <FiActivity /> Injury
                </div>
      
                <div className={`nav-item ${active === "ranking" ? "active" : ""}`} onClick={() => { setActive("ranking"); navigate("/ranking"); }}>
                  <FiAward /> Ranking
                </div>
      
                <div className={`nav-item ${active === "opportunities" ? "active" : ""}`} onClick={() => { setActive("opportunities"); navigate("/opportunities"); }}>
                  <FiTarget /> Opportunities
                </div>
      
                <div className={`nav-item ${active === "profile" ? "active" : ""}`} onClick={() => { setActive("profile"); navigate("/profile"); }}>
                  <FiUser /> Profile
                </div>
      
                <div className="nav-item logout" onClick={handleLogout} style={{ marginTop: 'auto', color: '#ff5252', cursor: 'pointer' }}>
                  <FiLogOut /> Logout
                </div>
      
              </nav>
        <div className="user-profile-mini">
          <div className="avatar"></div>
          <div className="user-info">
            <h4>{userName}</h4>
            <p>Pro Division I</p>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        
        {/* TOP BAR */}
        <header className="top-bar">
          <div className="search-bar">
            <FiSearch className="search-icon" />
            <input type="text" placeholder="Search biometrics, logs, or insights..." />
          </div>
          <div className="top-actions">
            <FiBell className="icon" />
            <FiSettings className="icon" />
            <span className="system-status"><span className="dot"></span> LIVE TRACKING</span>
          </div>
        </header>

        {/* HERO HEADER */}
        <div className="header-section">
          <div>
            <span className="subtitle">PERFORMANCE OVERVIEW</span>
            {/* DYNAMIC NAME INSERTED HERE */}
            <h1>Welcome back, {userName}.</h1> 
          </div>
          <div className="header-buttons">
            <button className="btn-secondary">Export Report</button>
            <button className="btn-primary">Start Session</button>
          </div>
        </div>

        {/* ROW 1: SCORE & QUICK STATS */}
        <div className="grid-row-1">
          <div className="card hero-card">
            <div className="hero-content">
              <span className="subtitle">CURRENT STANDING</span>
              <h2>Athlete Score</h2>
              <p>Your performance is in the <strong>top 4%</strong> for your age bracket. Recovery is optimal, but consistency in zone 4 training could be improved.</p>
              <div className="score-stats">
                <div>
                  <h3>84<span>/100</span></h3>
                  <p>GLOBAL INDEX</p>
                </div>
                <div>
                  <h3 className="text-green">+2.4</h3>
                  <p>VS. LAST WEEK</p>
                </div>
              </div>
            </div>
            <div className="hero-circle">
              <div className="progress-ring">
                <span className="ring-value">84</span>
                <span className="ring-label">ELITE</span>
              </div>
            </div>
          </div>

          <div className="quick-stats-grid">
            <div className="card stat-card">
              <div className="stat-icon text-cyan"><BiTrendingUp /></div>
              <p className="subtitle">FITNESS LEVEL</p>
              <h3>Level 42</h3>
            </div>
            <div className="card stat-card">
              <div className="stat-icon text-red">⚠️</div>
              <p className="subtitle">INJURY RISK</p>
              <h3>Low</h3>
            </div>
            <div className="card stat-card">
              <div className="stat-icon text-green">🎖️</div>
              <p className="subtitle">GLOBAL RANK</p>
              <h3>#1,204</h3>
            </div>
            <div className="card stat-card">
              <div className="stat-icon text-cyan">📈</div>
              <p className="subtitle">CONSISTENCY</p>
              <h3>98%</h3>
            </div>
          </div>
        </div>

        {/* ROW 2: INSIGHTS & CONSISTENCY */}
        <div className="grid-row-2">
          <div className="card insights-card">
            <div className="card-header">
              <h3><FiCpu /> AI Coach Insights</h3>
              <span className="badge">3 NEW</span>
            </div>
            <div className="insight-list">
              <div className="insight-item border-green">
                <div className="insight-top">
                  <h4 className="text-green">RECOVERY BOOST</h4>
                  <span>2m ago</span>
                </div>
                <p>HRV is 12% higher than average. You're cleared for a high-intensity session today.</p>
              </div>
              <div className="insight-item border-cyan">
                <div className="insight-top">
                  <h4 className="text-cyan">NUTRITION ALERT</h4>
                  <span>1h ago</span>
                </div>
                <p>Protein intake was sub-optimal during your last 48hr window. Adjust evening meal.</p>
              </div>
              <div className="insight-item border-red">
                <div className="insight-top">
                  <h4 className="text-red">INJURY WARNING</h4>
                  <span>4h ago</span>
                </div>
                <p>Lateral ankle torque detected during squat session. Recommendation: mobility drill 'A'.</p>
              </div>
            </div>
            <button className="btn-text">VIEW FULL ANALYSIS</button>
          </div>

          <div className="card consistency-card">
            <div className="card-header">
              <h3>Performance Consistency</h3>
              <div className="legend">
                <span><div className="heat-square level-0"></div> REST</span>
                <span><div className="heat-square level-1"></div> LOW</span>
                <span><div className="heat-square level-3"></div> PEAK</span>
              </div>
            </div>
            <div className="heatmap-container">
              {renderHeatmap()}
            </div>
            <div className="streak-stats">
              <div>
                <p>CURRENT STREAK</p>
                <h3>14 Days</h3>
              </div>
              <div>
                <p>BEST STREAK</p>
                <h3>42 Days</h3>
              </div>
              <div>
                <p>TOTAL WORKOUTS</p>
                <h3>342</h3>
              </div>
            </div>
          </div>
        </div>

        {/* ROW 3: BIOMETRICS */}
        <div className="card biometrics-card">
          <div className="bio-info">
            <h2>Live Biometrics</h2>
            <p>Real-time synchronization with wearable sensors and skeletal tracking systems.</p>
          </div>
          <div className="bio-stats">
            <div><p>HEART RATE</p><h3>64 <span>BPM</span></h3></div>
            <div><p>SPO2</p><h3>99 <span>%</span></h3></div>
            <div><p>BODY TEMP</p><h3>36.7 <span>°C</span></h3></div>
            <div><p>VO2 MAX</p><h3>58.2 <span>ML/KG</span></h3></div>
          </div>
        </div>

      </main>
    </div>
  );
}