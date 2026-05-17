const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/nutrition/diet-plan', async (req, res) => {
  const { goal, diet, sport } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!goal || !diet) {
    return res.status(400).json({ error: "Goal and diet type are required" });
  }

  // 🔥 Tumhara full professional prompt
  const prompt = `You are an elite sports nutritionist AI for ATHLETE OS platform.
Generate a highly personalized daily diet plan for a professional athlete with the following profile:
- Performance Goal: ${goal}
- Dietary Type: ${diet}
- Sport: ${sport || 'General Athletic Training'}

Respond ONLY with a valid JSON object (no markdown, no explanation, no backticks) in this exact structure:
{
  "macros": {
    "cals": "2,840",
    "protein": "180g",
    "carbs": "320g",
    "fats": "65g",
    "width": "75%"
  },
  "meals": [
    {
      "time": "06:30 AM • PRE-WORKOUT",
      "cals": 320,
      "title": "Meal Name Here",
      "desc": "Short description of the meal with nutritional benefits. Max 2 sentences.",
      "tags": ["TAG1", "TAG2"],
      "color": "cyan",
      "timeSlot": "pre-workout"
    },
    {
      "time": "09:00 AM • BREAKFAST",
      "cals": 480,
      "title": "Meal Name Here",
      "desc": "Short description of the meal with nutritional benefits. Max 2 sentences.",
      "tags": ["TAG1", "TAG2"],
      "color": "green",
      "timeSlot": "breakfast"
    },
    {
      "time": "01:30 PM • LUNCH",
      "cals": 640,
      "title": "Meal Name Here",
      "desc": "Short description of the meal with nutritional benefits. Max 2 sentences.",
      "tags": ["TAG1", "TAG2"],
      "color": "green",
      "timeSlot": "lunch"
    },
    {
      "time": "05:00 PM • RECOVERY SNACK",
      "cals": 280,
      "title": "Meal Name Here",
      "desc": "Short description of the meal with nutritional benefits. Max 2 sentences.",
      "tags": ["TAG1", "TAG2"],
      "color": "red",
      "timeSlot": "snack"
    },
    {
      "time": "08:30 PM • DINNER",
      "cals": 580,
      "title": "Meal Name Here",
      "desc": "Short description of the meal with nutritional benefits. Max 2 sentences.",
      "tags": ["TAG1", "TAG2"],
      "color": "cyan",
      "timeSlot": "dinner"
    }
  ],
  "aiInsight": "A personalized 2-sentence AI insight about the athlete's nutrition plan mentioning specific nutrients and recovery tips based on their goal.",
  "supplements": [
    "Supplement 1 (dose)",
    "Supplement 2 (dose)",
    "Supplement 3 (dose)"
  ],
  "micronutrients": [
    { "name": "Nutrient Name", "status": "OPTIMAL", "level": 90 },
    { "name": "Nutrient Name", "status": "GOOD", "level": 70 },
    { "name": "Nutrient Name", "status": "LOW", "level": 40 },
    { "name": "Nutrient Name", "status": "CRITICAL", "level": 25 }
  ]
}

Rules:
- For ${diet} diet: ${diet === 'Veg' ? 'Use ONLY vegetarian ingredients (no meat, fish, eggs). Use paneer, tofu, legumes, dairy, nuts, seeds.' : 'Include lean meats, fish, eggs. Prefer chicken, salmon, tuna, turkey.'}
- For ${goal}: ${goal === 'Build Muscle' ? 'High protein (1.8-2g/kg), moderate carbs, caloric surplus.' : goal === 'Stamina' ? 'High carbs for glycogen, moderate protein, higher calories for endurance.' : 'Caloric deficit, high protein to preserve muscle, low carbs.'}
- Keep meal names creative and specific
- Tags must be SHORT (max 2 words, ALL CAPS)
- color field must be exactly one of: "cyan", "green", "red"
- width in macros should reflect caloric intake as % (40-95%)
- micronutrient level is a number 0-100
- micronutrient status must be one of: "OPTIMAL", "GOOD", "LOW", "CRITICAL"`;
  const modelsToTry = ["gemini-1.5-flash", "gemini-pro"];
  let lastError = null;

  for (let modelName of modelsToTry) {
    try {
      console.log(`🚀 Trying model: ${modelName}...`);
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;
      const response = await axios.post(url, {
        contents: [{ parts: [{ text: prompt }] }]
      });

      const rawText = response.data.candidates[0].content.parts[0].text;
      const cleaned = rawText.replace(/```json|```/g, '').trim();
      
      return res.json({ success: true, plan: JSON.parse(cleaned) });

    } catch (err) {
      console.error(`❌ Failed with ${modelName}:`, err.response?.data?.error?.message || err.message);
      lastError = err;
    }
  }

  res.status(500).json({ 
    success: false, 
    error: "AI models are not responding. Check your API Key.",
    detail: lastError.response?.data?.error?.message || lastError.message 
  });
});

module.exports = router;