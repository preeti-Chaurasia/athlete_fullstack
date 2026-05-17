const express = require("express");
const router = express.Router();

const { getCoachFeedback } = require("../services/geminiService");

router.post("/chat", async (req, res) => {
  try {
    console.log("BODY RECEIVED:", req.body);

    const message = req.body?.message;

    if (!message) {
      return res.status(400).json({
        error: "message is required"
      });
    }

    const reply = await getCoachFeedback(message);

    res.json({ success: true, reply });

  } catch (error) {
    console.log("Route Error:", error.message);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;