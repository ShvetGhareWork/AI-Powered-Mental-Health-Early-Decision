const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getBasicUserInfo,
  getUserDetails,
  updateUserDetails,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// Register
router.post("/register", register);

// Login
router.post("/login", login);

// Get basic user info (authenticated)
router.get("/basic-info", protect, getBasicUserInfo);

// Get detailed user profile (authenticated)
router.get("/user-details", protect, getUserDetails);

// Update detailed user profile (authenticated)
router.post("/profileupdated", protect, updateUserDetails);

module.exports = router;
