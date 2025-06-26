const User = require("../model/User.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register User
exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      avatar,
      phoneNumber,
      dateOfBirth,
      gender,
      address,
      emergencyContact,
      currentMedication,
      allergies,
      therapistName,
      insuranceProvider,
      emergencyMedicalConditions,
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered." });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      avatar,
      phoneNumber,
      dateOfBirth,
      gender,
      address,
      emergencyContact,
      currentMedication,
      allergies,
      therapistName,
      insuranceProvider,
      emergencyMedicalConditions,
    });

    await newUser.save();

    res
      .status(201)
      .json({ message: "User registered successfully.", user: newUser });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Server error." });
  }
};

// Login User
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password." });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password." });

    // Sign JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Return token + minimal user info
    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// GET: Basic User Info (from req.user injected by auth middleware)
exports.getBasicUserInfo = (req, res) => {
  if (!req.user) return res.status(404).json({ message: "User not found." });

  res.status(200).json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
  });
};

// GET: Full User Profile (by ID in token)
exports.getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found." });

    res.status(200).json(user);
  } catch (err) {
    console.error("Fetch user details error:", err);
    res.status(500).json({ message: "Server error." });
  }
};

// POST: Update User Profile (including personal details)
exports.updateUserDetails = async (req, res) => {
  try {
    const updates = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found." });

    // Update allowed fields
    Object.assign(user, updates);

    await user.save();

    res.status(200).json({
      message: "User details updated successfully.",
      user,
    });
  } catch (err) {
    console.error("Update user details error:", err);
    res.status(500).json({ message: "Server error." });
  }
};
