const jwt = require("jsonwebtoken");
const User = require("../model/User.js");

exports.protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token)
    return res
      .status(401)
      .json({ message: "Not authorized, no token provided." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password"); // exclude password
    if (!req.user) return res.status(404).json({ message: "User not found." });
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};
