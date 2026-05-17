import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Ranking.css';
import { FaMedal, FaBolt, FaRunning } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { FiHome, FiCpu, FiCoffee, FiUser, FiSearch, FiBell, FiSettings, FiActivity, FiAward, FiTarget, FiLogOut, FiTrendingUp, FiChevronDown } from 'react-icons/fi';

export default function Ranking() {
  const [activeTab, setActiveTab] = useState('This Month');
  const [isRegistered, setIsRegistered] = useState(false);
  const [competitors, setCompetitors] = useState([]);
  
  const navigate = useNavigate();
  const [active, setActive] = useState("ranking"); 

  const userName = localStorage.getItem('userName') || 'Arjun S.';

  const handleLogout = () => {
    localStorage.clear(); 
    navigate('/'); 
  };

  const currentUser = { rank: 12, score: 84, pointsNeeded: 345 };

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
      // Variable define karo
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// Ab axios.get ko update karo
const res = await axios.get(`${API_BASE_URL}/api/leaderboard`);
setCompetitors(res.data);  
      } catch (err) {
        console.log("Using static data, backend not connected yet.");
      }
    };
    fetchLeaderboard();
  }, []);

  const handleRegister = async () => {
    try {
      const userId = localStorage.getItem('userId') || 1; 
      await axios.post('http://localhost:5000/api/register-event', {
        userId: userId,
        eventName: 'Global Invitational: The Velocity Games'
      });
      setIsRegistered(true);
      alert("Registration Successful!");
    } catch (err) {
      setIsRegistered(true);
      alert("Registered (UI Mode)");
    }
  };

  return (
    <div className="dashboard-container">
      
      {/* ================= SIDEBAR ================= */}
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
            <h4>{userName}</h4>
            <p>Pro Division I</p>
          </div>
        </div>
      </aside>

      {/* ================= MAIN CONTENT YAHAN SE SHURU HAI ================= */}
      <main className="main-content">
        
        {/* Top Search Bar */}
        <div className="ranking-header">
          <h1 className="text-cyan">Ranking</h1>
          <div className="search-bar">
            <FiSearch className="search-icon" />
            <input type="text" placeholder="Search athletes..." />
          </div>
        </div>

        {/* HERO CARD: User's Rank */}
        <div className="hero-rank-card">
          <div className="hero-rank-left">
            <div className="avatar-large avatar-arjun">
              <span className="pro-badge">PRO</span>
            </div>
            <div className="rank-info">
              <h2>Your Rank: <span>#{currentUser.rank}</span></h2>
              <p>Top 10% Global Athletes</p>
            </div>
            <div className="trend-indicator text-green">
              <FiTrendingUp /> +3 ranks this week
            </div>
          </div>
          
          <div className="hero-rank-right">
            <div className="score-box">
              <p>ATHLETE SCORE</p>
              <h3>{currentUser.score}<span>/100</span></h3>
            </div>
            <div className="level-box">
              <p>LEVEL</p>
              <h3 className="text-green">Elite</h3>
            </div>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="ranking-grid">
          
          {/* LEFT COLUMN: Leaderboard */}
          <div className="leaderboard-col">
            
            <div className="filters-row">
              <div className="dropdowns">
                <button className="filter-btn">All Sports <FiChevronDown/></button>
                <button className="filter-btn">Global <FiChevronDown/></button>
                <button className="filter-btn">Under 25</button>
              </div>
              <div className="time-tabs">
                {['This Week', 'This Month', 'All Time'].map(tab => (
                  <button 
                    key={tab}
                    className={`tab-btn ${activeTab === tab ? 'active-tab' : ''}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="table-header">
              <span>RANK</span>
              <span style={{flex: 2}}>ATHLETE</span>
              <span>SPORT</span>
              <span>ATHLETE SCORE</span>
              <span>PERFORMANCE</span>
            </div>

            <div className="competitors-list">
              <div className="athlete-row">
                <div className="rank-col text-gold"><FaMedal/> 1</div>
                <div className="athlete-col" style={{flex: 2}}>
                  <div className="avatar-small bg-cyan-light"></div>
                  <div><h4>Sarah Jenkins</h4><p className="text-muted">Global Elite</p></div>
                </div>
                <div className="sport-col">Triathlon</div>
                <div className="score-col">98 <div className="mini-bar"><div style={{width:'98%'}} className="bg-cyan"></div></div></div>
                <div className="badge-col"><span className="perf-badge badge-green">APEX</span></div>
              </div>

              <div className="athlete-row">
                <div className="rank-col text-silver"><FaMedal/> 2</div>
                <div className="athlete-col" style={{flex: 2}}>
                  <div className="avatar-small bg-blue-light"></div>
                  <div><h4>David Kostic</h4><p className="text-muted">North Am. Pro</p></div>
                </div>
                <div className="sport-col">CrossFit</div>
                <div className="score-col">94 <div className="mini-bar"><div style={{width:'94%'}} className="bg-cyan"></div></div></div>
                <div className="badge-col"><span className="perf-badge badge-green">APEX</span></div>
              </div>

              <div className="athlete-row highlighted-row">
                <div className="rank-col text-cyan">12</div>
                <div className="athlete-col" style={{flex: 2}}>
                  <div className="avatar-small avatar-arjun-small"></div>
                  <div><h4>{userName} (You) <span className="mini-pro">PRO</span></h4><p className="text-muted">Regional Champ</p></div>
                </div>
                <div className="sport-col">Sprint Track</div>
                <div className="score-col">84 <div className="mini-bar"><div style={{width:'84%'}} className="bg-cyan"></div></div></div>
                <div className="badge-col"><span className="perf-badge badge-green">ELITE</span></div>
              </div>
            </div>
            
            <button className="load-more-btn">LOAD MORE COMPETITORS</button>

          </div>

          {/* RIGHT COLUMN: Opportunities & Gamification */}
          <div className="opportunities-col">
            
            <div className="card gamify-card">
              <h3>Ascension Path</h3>
              <div className="target-row">
                <p className="text-muted">TARGET: TOP 10</p>
                <h2 className="text-cyan">1,240 pts</h2>
              </div>
              <div className="progress-bar-container">
                <div className="progress-bar-fill" style={{width: '75%'}}></div>
              </div>
              <p className="gamify-desc">You need <strong>{currentUser.pointsNeeded} more points</strong> to break into the Top 10. Win next week's Regional Open to qualify.</p>
            </div>

            <div className="card badge-card">
              <h3>Badge Collection</h3>
              <div className="badge-grid">
                <div className="badge-item locked"><div className="badge-circle"><FaRunning/></div><span>BEGINNER</span></div>
                <div className="badge-item locked"><div className="badge-circle"><FaRunning/></div><span>INTERMEDIATE</span></div>
                <div className="badge-item unlocked cyan-badge"><div className="badge-circle bg-cyan-glow"><FaBolt/></div><span>ADVANCED</span></div>
                <div className="badge-item unlocked green-badge"><div className="badge-circle bg-green-glow"><FaMedal/></div><span>ELITE</span><span className="active-dot"></span></div>
              </div>
            </div>

            <div className="event-card">
              <div className="event-content">
                <span className="event-tag text-cyan">UPCOMING EVENT</span>
                <h2>Global Invitational: The Velocity Games</h2>
                <button 
                  className={`btn-register ${isRegistered ? 'registered' : ''}`}
                  onClick={handleRegister}
                  disabled={isRegistered}
                >
                  {isRegistered ? 'REGISTERED ✓' : 'REGISTER NOW'}
                </button>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}