const express = require("express");
const router = express.Router();
const {
  incrementAssessment,
  incrementChatSession,
  incrementHealthCheck,
  getHealthStats,
  getMentalHealthMetrics,
} = require("../controllers/healthController");

// Increment health check
router.post("/health-check/:userId", incrementHealthCheck);

// Increment assessment
router.post("/assessment/:userId", incrementAssessment);

// Increment chat session count
router.post("/mood-session/:userId", incrementChatSession);

// Get today's health stats
router.get("/stats/:userId", getHealthStats);

module.exports = router;
