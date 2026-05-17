import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./LoginPage.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  // 1️⃣ Common function jo login process handle karega
  const performLogin = async (loginEmail, loginPassword) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/api/login`, {
        email: loginEmail,
        password: loginPassword,
      });

      if (res.data.success) {
        alert("Login Success ✅");
        
        // Dono tarah ke IDs aur details save kar lo jo tumne use kiye hain
        localStorage.setItem('userId', res.data.user.id);
        localStorage.setItem('userName', res.data.user.full_name);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        navigate("/dashboard");
      }
    } catch (err) {
      alert("Login Failed ❌. Check credentials.");
    }
  };

  // 2️⃣ Normal Login (Form Submit)
  const handleLogin = (e) => {
    e.preventDefault();
    performLogin(email, password);
  };

  // 3️⃣ 🔥 GUEST LOGIN (Auto-fill and Login)
  const handleGuestLogin = () => {
    const guestEmail = "arjun@athleteos.com";
    const guestPassword = "password123"; // Apne "passwoed" spelling ke hisaab se

    setEmail(guestEmail);
    setPassword(guestPassword);

    // Seedha login function call kar do
    performLogin(guestEmail, guestPassword);
  };

  return (
    <div className="container">
      <div className="left">
        <h4 className="logo">ATHLETE OS</h4>
        <h1 className="title">Empowering <br /> Every <span>Athlete’s</span> <br /> Journey with AI</h1>
        <p className="subtitle">Access your personalized biomechanical engine.</p>
        <div className="card">
          <p>ACTIVE TRACKING</p>
          <h2>142 BPM ❤️</h2>
          <div className="progress"></div>
        </div>
      </div>

      <div className="right">
        <h2>Initialize Session</h2>
        <p className="desc">Sign in to sync your performance profile.</p>

        <form onSubmit={handleLogin}>
          <label>Email</label>
          <input
            type="email"
            placeholder="name@athleteos.ai"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" className="btn">INITIALIZE SESSION</button>
        </form>

        <div className="divider">OR AUTHENTICATE VIA</div>

        <button className="google-btn">Continue with Google</button>

        {/* 4️⃣ 🔥 Naya Guest Button yahan add kiya */}
        <button type="button" className="guest-btn" onClick={handleGuestLogin}>
          LOGIN AS GUEST (DEMO)
        </button>

        <p className="apply">New operative? <span>Apply for Access</span></p>
      </div>
    </div>
  );
};

export default Login;