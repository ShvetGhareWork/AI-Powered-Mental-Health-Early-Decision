const jwt = require("jsonwebtoken");
const User = require("../model/User.js");

const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token)
    return res.status(401).json({ message: "Not authorized, token missing" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user details (excluding password)
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = protect;
