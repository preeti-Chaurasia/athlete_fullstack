const pool = require("../config/db");
const injuryService = require("../services/injuryService");


// ✅ GET ATHLETE BASELINE
exports.getAthleteBaseline = async (req, res) => {
  try {
    const { id } = req.params;

    const athleteData = await pool.query(
      "SELECT * FROM athletes WHERE id = $1",
      [id]
    );

    if (athleteData.rows.length === 0) {
      return res.status(404).json({ message: "Athlete not found" });
    }

    res.json(athleteData.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch baseline" });
  }
};



// ✅ GET FULL HISTORY
exports.getFullHistory = async (req, res) => {
  try {
    const { id } = req.params;

    const history = await pool.query(
      `
      SELECT *
      FROM daily_logs
      WHERE athlete_id = $1
      ORDER BY created_at DESC
      `,
      [id]
    );

    res.json(history.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch history" });
  }
};
// ✅ PREDICT INJURY
exports.predictInjury = async (req, res) => {
  try {
    const { athleteId, sleep, load, stress, fatigue } = req.body;

    console.log("BODY RECEIVED:", req.body);

    // Validate inputs
    if (
      athleteId == null ||
      sleep == null ||
      load == null ||
      stress == null ||
      fatigue == null
    ) {
      return res.status(400).json({
        message: "All 4 numeric inputs required"
      });
    }

    //  AI Risk Calculation
    let riskScore =
      (10 - sleep) * 2 +
      load * 1.5 +
      stress * 2 +
      fatigue * 2;

      riskScore = Math.round(riskScore);
    let riskLevel = "Low";
    let advice = "";

    if (riskScore > 30) {
      riskLevel = "High\n";
      advice =
        "⚠ High Injury Risk Detected.\n\n" +
        "- Immediate recovery session recommended\n\n" +
        "- Reduce training intensity by 40%\n\n" +
        "- Prioritize 8+ hours sleep\n\n" +
        "- Monitor muscle soreness closely";
    } else if (riskScore > 18) {
      riskLevel = "Moderate\n";
      advice =
        "⚠ Moderate Risk.\n" +
        "- Reduce load slightly\n" +
        "- Add stretching and recovery\n" +
        "- Monitor fatigue tomorrow";
    } else {
      riskLevel = "Low";
      advice =
        "✔ Low Risk.\n" +
        "- Continue normal training\n" +
        "- Maintain recovery balance";
    }

    const result = {
      injuryScore: riskScore,
      riskLevel,
      advice
    };

    console.log("AI RESULT:", result);

    // ✅ SAVE INTO daily_logs (FIXED VARIABLE NAME)
    await pool.query(
      `INSERT INTO daily_logs
       (athlete_id, sleep, fatigue, load, stress, injury_score, risk_level)
       VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [athleteId, sleep, fatigue, load, stress, riskScore, riskLevel]
    );

    res.json(result);

  } catch (error) {
    console.error("Prediction Error:", error);
    res.status(500).json({ message: "Prediction failed" });
  }
};