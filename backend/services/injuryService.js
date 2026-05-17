exports.calculateRisk = (athlete, today, history) => {

  const { sleep, load, stress, fatigue } = today;

  let score = 0;

  /* ===============================
     🔥 TREND ANALYSIS (NEW LOGIC)
  =============================== */

  let avgLoad = 0;
  let avgFatigue = 0;

  if (history.length > 0) {
    avgLoad = history.reduce((sum, d) => sum + d.load, 0) / history.length;
    avgFatigue = history.reduce((sum, d) => sum + d.fatigue, 0) / history.length;
  }

  const loadSpike = avgLoad > 0 ? ((load - avgLoad) / avgLoad) * 100 : 0;
  const fatigueSpike = avgFatigue > 0 ? ((fatigue - avgFatigue) / avgFatigue) * 100 : 0;

  // 🔥 Base Daily Impact
  score += load * 4;
  score += fatigue * 5;
  score += stress * 3;

  if (sleep < 6) score += 15;

  // 🔥 Spike Effect (THIS MAKES IT SMART)
  if (loadSpike > 30) score += 20;
  if (fatigueSpike > 30) score += 20;

  // Clamp
  score = Math.max(0, Math.min(100, score));

  let riskLevel = "Low";
  if (score >= 75) riskLevel = "High";
  else if (score >= 45) riskLevel = "Medium";

  /* ===============================
     🔥 INTELLIGENT MESSAGE
  =============================== */

  let insightMessage = "";

  if (loadSpike > 30) {
    insightMessage = `Your training load increased by ${loadSpike.toFixed(0)}% compared to your weekly average. Sudden spikes increase injury risk.`;
  }
  else if (fatigueSpike > 30) {
    insightMessage = `Your fatigue is ${fatigueSpike.toFixed(0)}% higher than usual. Accumulated fatigue raises soft-tissue injury probability.`;
  }
  else {
    insightMessage = "No abnormal workload spike detected. Your load trend is stable.";
  }

  return {
    injuryScore: score,
    riskLevel,
    loadSpike: loadSpike.toFixed(1),
    fatigueSpike: fatigueSpike.toFixed(1),
    trendInsight: insightMessage
  };
};