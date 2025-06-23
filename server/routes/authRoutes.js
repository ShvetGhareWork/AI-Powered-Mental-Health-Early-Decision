const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getUserDetails,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// Register
router.post("/register", register);

// Login
router.post("/login", login);

// get user details
router.get("/user-details", protect, getUserDetails);

module.exports = router;
