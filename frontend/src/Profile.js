import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import './Profile.css';
// Profile.js ki purani import line hatakar ye paste karein 👇
// 👇 IS NAYI LINE KO COPY KARKE TOP PAR PASTE KAREIN 👇
import { 
  FiHome, FiCpu, FiCoffee, FiUser, FiSearch, FiBell, FiSettings, 
  FiActivity, FiAward, FiTarget, FiLogOut, 
  FiCheck, FiEdit2, FiClock, FiAlertTriangle 
} from 'react-icons/fi';
export default function Profile() {

  
  
  // YAHAN STATE ADD HUI HAI
  const [active, setActive] = useState("profile");

  // State variables form ko interactive banane ke liye
  const [profileData, setProfileData] = useState({
    dob: '14 August 1998',
    gender: 'Male',
    location: 'New Delhi, IN',
    primarySport: 'Athletics (Sprints)',
    specialization: '100m / 200m',
    proYears: '6',
    height: '182',
    weight: '76.4',
    restingHR: '48'
  });

  // Jab user type karega, toh state update hogi
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };
 const navigate = useNavigate();

const handleLogout = () => {
  // 🔥 localStorage clear
  localStorage.removeItem("userId");

  // (optional) sab clear karna ho to:
  // localStorage.clear();

  // 🔥 redirect to login page
  navigate("/");
};

  // Save button click hone par ye function chalega

// ... andar function mein:

const handleSaveProfile = async () => {
    try {
      // 1. Local storage se logged-in user ki ID nikaalo
      const userId = localStorage.getItem('userId');
      
      // 2. Agar user login nahi hai (ID nahi mili), toh error dikhao aur rok do
      if (!userId) {
        alert("Please login first to save your profile!");
        return; 
      }

      console.log("Saving data for User ID:", userId);

      // 3. Backend API ko data bhejo, URL mein userId lagakar
      // Variable define karo
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// Ab URL ko update karo
const response = await axios.put(`${API_BASE_URL}/api/profile/${userId}`, profileData);
      
      alert("Profile Successfully Updated!");
      
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile. Check console for details.");
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
          <div className="avatar avatar-arjun"></div>
          <div className="user-info">
            <h4>Arjun Singh</h4>
            <p>Tier: Elite Pro</p>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        {/* TOP BAR */}
        <header className="top-bar">
          <div className="search-bar">
            <FiSearch className="search-icon" />
            <input type="text" placeholder="Search metrics, history, or insights..." />
          </div>
          <div className="top-actions">
            <FiBell className="icon" />
            <FiSettings className="icon" />
            <span className="system-status"><span className="dot"></span> SYSTEM STATUS: <span className="text-green" style={{marginLeft: '4px'}}>Optimal</span></span>
          </div>
        </header>

        {/* PROFILE LAYOUT GRID */}
        <div className="profile-grid">
          
          {/* LEFT COLUMN: Identity Card */}
          <div className="profile-left-col">
            <div className="card identity-card">
              <div className="identity-avatar-container">
                <div className="identity-avatar"></div>
                <span className="rank-badge">RANK #04</span>
              </div>
              <h1 className="athlete-name">ARJUN SINGH</h1>
              <p className="athlete-title text-cyan">NATIONAL TRACK ELITE</p>
              
              <div className="identity-stats">
                <div><p>WINS</p><h3>12</h3></div>
                <div><p>PODIUMS</p><h3>24</h3></div>
                <div><p>SCORE</p><h3 className="text-green">98.2</h3></div>
              </div>

              <div className="qr-section">
                <div className="qr-header">
                  <p>PUBLIC IDENTITY TOKEN</p>
                  <FiCheck className="text-cyan" />
                </div>
                <div className="qr-box">
                  {/* Fake QR Image */}
                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=AthleteOS-ArjunSingh" alt="QR Token" />
                </div>
                <p className="qr-desc">Secure verification token for event registrations and medical access.</p>
              </div>
            </div>

            <div className="card connect-wearables">
              <div className="wearable-icon"><FiSettings /></div>
              <div>
                <h4>CONNECT WEARABLES</h4>
                <p>Sync WHOOP, Garmin, or Apple</p>
              </div>
              <span className="arrow-right">›</span>
            </div>
          </div>

          {/* RIGHT COLUMN: Edit Forms */}
          <div className="profile-right-col">
            <div className="profile-header">
              <div>
                <h1>Digital Twin</h1>
                <p className="subtitle-text">Profile data powers your biometric AI modeling.</p>
              </div>
              <div className="profile-actions">
                <button className="btn-secondary">Cancel</button>
                <button className="btn-primary" onClick={handleSaveProfile}>Save Profile</button>
              </div>
            </div>

            <div className="form-row">
              {/* Basic Information */}
              <div className="card form-card">
                <h3 className="card-title"><FiUser className="text-cyan"/> Basic Information</h3>
                
                <label>DATE OF BIRTH</label>
                <input type="text" name="dob" value={profileData.dob} onChange={handleInputChange} className="form-input" />
                
                <div className="form-split">
                  <div>
                    <label>GENDER</label>
                    <select name="gender" value={profileData.gender} onChange={handleInputChange} className="form-input">
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label>LOCATION</label>
                    <input type="text" name="location" value={profileData.location} onChange={handleInputChange} className="form-input" />
                  </div>
                </div>
              </div>

              {/* Sports Credentials */}
              <div className="card form-card">
                <h3 className="card-title"><FiCheck className="text-cyan"/> Sports Credentials</h3>
                
                <label>PRIMARY SPORT</label>
                <input type="text" name="primarySport" value={profileData.primarySport} onChange={handleInputChange} className="form-input" />
                
                <div className="form-split">
                  <div>
                    <label>SPECIALIZATION</label>
                    <input type="text" name="specialization" value={profileData.specialization} onChange={handleInputChange} className="form-input" />
                  </div>
                  <div>
                    <label>PRO YEARS</label>
                    <input type="number" name="proYears" value={profileData.proYears} onChange={handleInputChange} className="form-input" />
                  </div>
                </div>
              </div>
            </div>

            {/* Real-Time Biometrics */}
            <div className="card form-card">
              <h3 className="card-title">📈 Real-Time Biometrics</h3>
              <div className="biometrics-grid">
                <div>
                  <label>HEIGHT (CM)</label>
                  <div className="input-with-unit">
                    <input type="number" name="height" value={profileData.height} onChange={handleInputChange} className="form-input naked-input" />
                  </div>
                </div>
                <div>
                  <label>WEIGHT (KG)</label>
                  <div className="input-with-unit">
                    <input type="number" step="0.1" name="weight" value={profileData.weight} onChange={handleInputChange} className="form-input naked-input" />
                    <span className="unit">cm</span> {/* Keeping visual accuracy to image, though cm for weight is a typo in the UI mockup! */}
                  </div>
                </div>
                <div>
                  <label>RESTING HR</label>
                  <div className="input-with-unit">
                    <input type="number" name="restingHR" value={profileData.restingHR} onChange={handleInputChange} className="form-input naked-input text-green font-bold" />
                    <span className="unit">kg</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Injury Log */}
            <div className="card form-card">
              <div className="card-header-flex">
                <h3 className="card-title">🚑 Injury Log & Medical History</h3>
                <button className="btn-text text-cyan">+ ADD RECORD</button>
              </div>
              
              <div className="injury-list">
                <div className="injury-item bg-darker">
                  <div className="injury-icon bg-red-light text-red"><FiAlertTriangle /></div>
                  <div className="injury-details">
                    <h4>Left Hamstring Grade II Strain</h4>
                    <p>Recovered • March 2023 • Physio Clearance Recieved</p>
                  </div>
                  <FiEdit2 className="edit-icon" />
                </div>

                <div className="injury-item bg-darker">
                  <div className="injury-icon bg-green-light text-green"><FiClock /></div>
                  <div className="injury-details">
                    <h4>Right Ankle Sprain</h4>
                    <p>Fully Resolved • Nov 2021</p>
                  </div>
                  <FiEdit2 className="edit-icon" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}