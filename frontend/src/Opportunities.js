import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Opportunities.css';
import { 
  FiHome, FiCpu, FiCoffee, FiUser, FiSearch, FiBell, FiSettings, 
  FiActivity, FiAward, FiTarget, FiLogOut, FiCalendar, FiMapPin, FiArrowRight 
} from 'react-icons/fi';

export default function Opportunities() {
  const navigate = useNavigate();
  const [active, setActive] = useState("opportunities");
  const userName = localStorage.getItem('userName') || 'Dharmi'; // Automatically takes correct name

  const [activeFilter, setActiveFilter] = useState('All Events');
  const [events, setEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);

  const filters = ['All Events', 'Athletics', 'Swimming', 'Weightlifting', 'Boxing', 'Cycling'];

  // Backend se Events Fetch Karna
  useEffect(() => {
    const fetchEvents = async () => {
      try {
  // Variable define karo (laptop aur live dono ke liye)
  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  // URL ko dynamic banao
  const res = await axios.get(`${API_BASE_URL}/api/opportunities?category=${activeFilter}`);
  
  setEvents(res.data);
} catch (err) {
        console.log("Backend offline, loading fallback data.");
        // Fallback UI data
        const fallback = [
          { id: 1, title: 'National Sprint Open', category: 'Athletics', date_range: 'Aug 12 - Aug 15, 2024', location: 'New Delhi National Stadium', badge1: 'ELITE LEVEL', badge2: '+240 XP', bg_class: 'bg-sprint' },
          { id: 2, title: 'Asia Pacific Aquatics', category: 'Swimming', date_range: 'Sept 05 - Sept 10, 2024', location: 'Singapore Hub', badge1: 'QUALIFIER', badge2: 'HIGH AFFINITY', bg_class: 'bg-swim' },
          { id: 3, title: 'Global Strength Summit', category: 'Weightlifting', date_range: 'Oct 22 - Oct 25, 2024', location: 'Mumbai Expo Centre', badge1: 'INVITATIONAL', badge2: '+500 XP', bg_class: 'bg-lift' }
        ];
        // Filter locally if backend is off
        setEvents(activeFilter === 'All Events' ? fallback : fallback.filter(e => e.category === activeFilter));
      }
    };
    fetchEvents();
  }, [activeFilter]);

  const handleRegister = async (eventId) => {
    try {
      const userId = localStorage.getItem('userId') || 1;
      await axios.post('http://localhost:5000/api/opportunities/register', { userId, eventId });
      setRegisteredEvents([...registeredEvents, eventId]);
      alert("Successfully Secured Slot!");
    } catch (err) {
      setRegisteredEvents([...registeredEvents, eventId]);
      alert("Registered (UI Mode)");
    }
  };

  const handleLogout = () => {
    localStorage.clear(); 
    navigate('/'); 
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

      {/* ================= MAIN CONTENT ================= */}
      <main className="main-content">
        
        {/* Top Search Bar */}
        <div className="top-bar">
          <div className="search-bar">
            <FiSearch className="search-icon" />
            <input type="text" placeholder="Explore championships..." />
          </div>
          <div className="top-actions">
            <FiBell className="icon" />
            <FiSettings className="icon" />
            <div className="avatar-small"></div>
          </div>
        </div>

        {/* Header Section */}
        <div className="header-section">
          <h1 style={{fontSize: '36px', marginBottom: '12px'}}>Opportunities Hub</h1>
          <p className="text-muted" style={{maxWidth: '800px', lineHeight: '1.6'}}>
            The Oracle has synthesized upcoming global qualifiers and high-performance meets. Based on your current VO2 Max and recovery trends, these events offer the highest impact for your career progression.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="filter-buttons">
          {filters.map(filter => (
            <button 
              key={filter} 
              className={`opp-filter-btn ${activeFilter === filter ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Dynamic Grid: Top Row (3 Cards) */}
        <div className="opp-grid-top">
          {events.length > 0 ? events.map((event) => (
            <div className={`event-card-vertical ${event.bg_class}`} key={event.id}>
              <div className="event-badges">
                <span className="badge badge-green">{event.badge1}</span>
                <span className="badge badge-cyan">{event.badge2}</span>
              </div>
              <div className="event-info">
                <h2>{event.title}</h2>
                <p><FiCalendar /> {event.date_range}</p>
                <p><FiMapPin /> {event.location}</p>
                <button className="btn-outline-white">VIEW DETAILS</button>
              </div>
            </div>
          )) : (
            <p className="text-muted">No events found for this category.</p>
          )}
        </div>

        {/* Grid: Bottom Row (Wide Card + Trajectory Card) */}
        <div className="opp-grid-bottom">
          
          {/* Main Diamond League Card */}
          <div className="wide-event-card">
            <div className="wide-content">
              <span className="badge badge-green">DIAMOND LEAGUE PATH</span>
              <h1>Continental Grand Prix Series</h1>
              <p className="wide-desc text-muted">
                This series is your primary gate to the Diamond League. Oracle analysis suggests your current endurance metrics are peaking perfectly for the series start.
              </p>
              
              <div className="prize-row">
                <div>
                  <p className="label">PRIZE POOL</p>
                  <h3>$150,000</h3>
                </div>
                <div>
                  <p className="label">RANKING PTS</p>
                  <h3 className="text-green">1,200</h3>
                </div>
              </div>

              <button 
                className={`btn-cyan-glow ${registeredEvents.includes(99) ? 'registered' : ''}`}
                onClick={() => handleRegister(99)}
                disabled={registeredEvents.includes(99)}
              >
                {registeredEvents.includes(99) ? 'SLOT SECURED ✓' : 'SECURE SLOT'}
              </button>
            </div>
          </div>

          {/* Career Trajectory Card */}
          <div className="trajectory-card card">
            <h3>Career Trajectory</h3>
            <div className="rating-box">
              <div>
                <p className="label">CURRENT RATING</p>
                <h1 className="text-cyan">88.4</h1>
              </div>
              <div className="bars-icon">
                <div className="bar b1"></div>
                <div className="bar b2"></div>
                <div className="bar b3"></div>
                <div className="bar b4"></div>
              </div>
            </div>
            
            <div className="goal-alignment">
              <p className="label">GOAL ALIGNMENT</p>
              <div className="progress-bar-container">
                <div className="progress-bar-fill bg-green" style={{width: '75%'}}></div>
              </div>
              <p className="text-muted" style={{fontSize: '11px', lineHeight: '1.4', marginTop: '10px'}}>
                You are <strong className="text-green">75% ready</strong> for elite international qualifiers based on biometric consistency.
              </p>
            </div>

            <button className="btn-link text-cyan">AI OPTIMIZATION REPORT <FiArrowRight/></button>
          </div>

        </div>
      </main>
    </div>
  );
}