import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AiCoach.css";

import { Pose } from "@mediapipe/pose";
import { Camera } from "@mediapipe/camera_utils";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";

import {
  FiHome,
  FiCpu,
  FiCoffee,
  FiUser,
  FiSearch,
  FiBell,
  FiSettings,
  FiActivity,
  FiAward,
  FiTarget,
  FiLogOut,
  FiX,
  FiCamera,
  FiUpload
} from "react-icons/fi";

export default function AiCoach() {
  const navigate = useNavigate();

  // ---------------- STATE ----------------
  const [active] = useState("aicoach");

  const [videoSrc, setVideoSrc] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const [message, setMessage] = useState("");
  const [aiReply, setAiReply] = useState("");
  const [loading, setLoading] = useState(false);

  const [depth, setDepth] = useState(0);
  const [kneeAngle, setKneeAngle] = useState(0);
  const [posture, setPosture] = useState("Waiting...");
  const [reps, setReps] = useState(0);
  const [downPosition, setDownPosition] = useState(false);

  // ---------------- REFS ----------------
  const fileInputRef = useRef(null);
  const liveVideoRef = useRef(null);
  const uploadVideoRef = useRef(null);
  const canvasRef = useRef(null);

  const poseRef = useRef(null);
  const cameraRef = useRef(null);

  // ---------------- LOGOUT ----------------
  const handleLogout = () => {
    localStorage.removeItem("userId");
    navigate("/");
  };

  // ---------------- AI CHAT ----------------
  const askCoach = async () => {
    if (!message.trim()) return;

    try {
      setLoading(true);

// Pehle ek variable bana lo (Ya ise file ke sabse upar bhi rakh sakte ho)
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const res = await fetch(`${API_BASE_URL}/api/coach/chat`, { // <-- Bas yahan change hua hai
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message,
      metrics: {
        depth,
        kneeAngle,
        posture,
        reps
      }
    })
});

      const data = await res.json();
      setAiReply(data.reply || "No response");
    } catch (error) {
      setAiReply("Backend error");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- ANGLE ----------------
  const calculateAngle = (a, b, c) => {
    const ab = { x: a.x - b.x, y: a.y - b.y };
    const cb = { x: c.x - b.x, y: c.y - b.y };

    const dot = ab.x * cb.x + ab.y * cb.y;
    const magAB = Math.sqrt(ab.x * ab.x + ab.y * ab.y);
    const magCB = Math.sqrt(cb.x * cb.x + cb.y * cb.y);

    const angle = Math.acos(dot / (magAB * magCB));
    return (angle * 180) / Math.PI;
  };

  // ---------------- MEDIAPIPE RESULTS ----------------
  const onResults = (results) => {
    if (!canvasRef.current) return;
    if (!results.poseLandmarks) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const source =
      liveVideoRef.current && liveVideoRef.current.videoWidth > 0
        ? liveVideoRef.current
        : uploadVideoRef.current;

    if (!source || !source.videoWidth) return;

    canvas.width = source.videoWidth;
    canvas.height = source.videoHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawConnectors(ctx, results.poseLandmarks, Pose.POSE_CONNECTIONS, {
      color: "#00e5ff",
      lineWidth: 3
    });

    drawLandmarks(ctx, results.poseLandmarks, {
      color: "#00ff99",
      lineWidth: 2
    });

    const lm = results.poseLandmarks;

    const hip = lm[24];
    const knee = lm[26];
    const ankle = lm[28];
    const shoulder = lm[12];

    const angle = calculateAngle(hip, knee, ankle);

    setKneeAngle(Math.round(angle));
    setDepth(Math.round(Math.max(0, 180 - angle)));

    if (shoulder.x > hip.x + 0.08) {
      setPosture("Lean Forward");
    } else {
      setPosture("Good");
    }

    if (angle < 95 && !downPosition) {
      setDownPosition(true);
    }

    if (angle > 155 && downPosition) {
      setReps((prev) => prev + 1);
      setDownPosition(false);
    }
  };

  // ---------------- INIT MEDIAPIPE ----------------
  useEffect(() => {
    const pose = new Pose({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
    });

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    pose.onResults(onResults);
    poseRef.current = pose;

    return () => {
      stopCamera();
    };
  }, [downPosition]);

  // ---------------- START CAMERA ----------------
  const startCamera = async () => {
    try {
      stopCamera();
      setVideoSrc(null);

      setIsCameraActive(true);

      setTimeout(async () => {
        if (!liveVideoRef.current) return;

        const camera = new Camera(liveVideoRef.current, {
          onFrame: async () => {
            if (poseRef.current && liveVideoRef.current) {
              await poseRef.current.send({
                image: liveVideoRef.current
              });
            }
          },
          width: 640,
          height: 480
        });

        cameraRef.current = camera;
        await camera.start();
      }, 300);
    } catch (error) {
      console.log(error);
      alert("Camera permission denied");
    }
  };

  // ---------------- STOP CAMERA ----------------
  const stopCamera = () => {
    setIsCameraActive(false);

    if (cameraRef.current) {
      cameraRef.current.stop();
      cameraRef.current = null;
    }
  };

  // ---------------- UPLOAD VIDEO ----------------
  const handleUploadClick = () => {
    stopCamera();
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    stopCamera();

    const url = URL.createObjectURL(file);
    setVideoSrc(url);
  };

  // ---------------- VIDEO ANALYSIS ----------------
  const handleUploadedPlay = () => {
    const detect = async () => {
      if (
        uploadVideoRef.current &&
        !uploadVideoRef.current.paused &&
        !uploadVideoRef.current.ended
      ) {
        await poseRef.current.send({
          image: uploadVideoRef.current
        });

        requestAnimationFrame(detect);
      }
    };

    detect();
  };

  // ---------------- UI ----------------
  return (
    <div className="dashboard-container">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="logo-section">
          <h2>ATHLETE OS</h2>
          <span>ELITE PERFORMANCE</span>
        </div>

        <nav className="side-nav">
          <div className="nav-item" onClick={() => navigate("/dashboard")}>
            <FiHome /> Dashboard
          </div>

          <div className="nav-item active">
            <FiCpu /> AI Coach
          </div>

          <div className="nav-item" onClick={() => navigate("/nutrition")}>
            <FiCoffee /> Nutrition
          </div>

          <div className="nav-item" onClick={() => navigate("/injury")}>
            <FiActivity /> Injury
          </div>

          <div className="nav-item" onClick={() => navigate("/ranking")}>
            <FiAward /> Ranking
          </div>

          <div className="nav-item" onClick={() => navigate("/opportunities")}>
            <FiTarget /> Opportunities
          </div>

          <div className="nav-item" onClick={() => navigate("/profile")}>
            <FiUser /> Profile
          </div>

          <div
            className="nav-item logout"
            style={{ color: "red", marginTop: "auto" }}
            onClick={handleLogout}
          >
            <FiLogOut /> Logout
          </div>
        </nav>
      </aside>

      {/* MAIN */}
      <main className="main-content">
        <header className="top-bar">
          <div className="search-bar">
            <FiSearch />
            <input placeholder="Search..." />
          </div>

          <div className="top-actions">
            <FiBell className="icon" />
            <FiSettings className="icon" />
          </div>
        </header>

        {/* HEADER */}
        <div className="header-section ai-header">
          <h1>
            AI Biomechanics <span className="text-cyan">Coach</span>
          </h1>

          <input
            ref={fileInputRef}
            type="file"
            hidden
            accept="video/*"
            onChange={handleFileChange}
          />

          <div className="header-action-buttons">
            {isCameraActive ? (
              <button className="btn-outline-red" onClick={stopCamera}>
                <FiX /> Stop Camera
              </button>
            ) : (
              <button className="btn-outline-cyan" onClick={startCamera}>
                <FiCamera /> Use Camera
              </button>
            )}

            <button className="btn-primary" onClick={handleUploadClick}>
              <FiUpload /> Upload Video
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="ai-content-grid">
          {/* LEFT */}
          <div className="left-column">
            <div className="video-player-card">
              <div
                className="video-placeholder"
                style={{
                  position: "relative",
                  width: "100%",
                  height: "500px",
                  background: "#000",
                  borderRadius: "12px",
                  overflow: "hidden"
                }}
              >
                {isCameraActive ? (
                  <video
                    ref={liveVideoRef}
                    autoPlay
                    playsInline
                    muted
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover"
                    }}
                  />
                ) : videoSrc ? (
                  <video
                    ref={uploadVideoRef}
                    src={videoSrc}
                    controls
                    autoPlay
                    onPlay={handleUploadedPlay}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain"
                    }}
                  />
                ) : null}

                <canvas
                  ref={canvasRef}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    pointerEvents: "none"
                  }}
                />
              </div>
            </div>

            {/* METRICS */}
            <div className="video-metrics-row">
              <div className="metric-box border-green">
                <p>DEPTH</p>
                <h3>{depth}%</h3>
              </div>

              <div className="metric-box border-red">
                <p>KNEE ANGLE</p>
                <h3>{kneeAngle}°</h3>
              </div>

              <div className="metric-box border-cyan">
                <p>POSTURE</p>
                <h3>{posture}</h3>
              </div>

              <div className="metric-box border-green">
                <p>REPS</p>
                <h3>{reps}</h3>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="right-column">
            <div className="card feedback-card">
              <h3>📊 Live Analysis</h3>

              <div className="feedback-pills">
                <div className="pill pill-green">Depth: {depth}%</div>
                <div className="pill pill-red">Knee: {kneeAngle}°</div>
                <div className="pill pill-grey">Posture: {posture}</div>
                <div className="pill pill-green">Reps: {reps}</div>
              </div>
            </div>

            <div className="card suggestions-card">
              <h3>AI Coach Suggestions</h3>

              <div className="ai-chat-box">
                <input
                  type="text"
                  placeholder="Ask your AI Coach..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />

                <button className="btn-outline-cyan" onClick={askCoach}>
                  {loading ? "Thinking..." : "Ask AI Coach"}
                </button>

                {aiReply && (
                  <div className="ai-response">
                    🤖 {aiReply}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}