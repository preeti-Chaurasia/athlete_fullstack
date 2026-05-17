const express = require("express");
const router = express.Router();

const {
  predictInjury,
  getAthleteBaseline,
  getFullHistory   
} = require("../controllers/predictionController");

router.post("/", predictInjury);
router.get("/athlete-baseline/:id", getAthleteBaseline);
router.get("/history/:id", getFullHistory);

module.exports = router;