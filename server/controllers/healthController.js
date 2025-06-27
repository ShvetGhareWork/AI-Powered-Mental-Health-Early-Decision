const User = require("../model/User");

// Increment Health Check Counter
exports.incrementHealthCheck = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    await resetIfNeeded(user);

    user.healthDetails.healthChecksToday += 1;
    await user.save();

    res.json({
      message: "Health check recorded",
      healthChecksToday: user.healthDetails.healthChecksToday,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Increment Assessment Counter
exports.incrementAssessment = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    await resetIfNeeded(user);

    user.healthDetails.assessmentsToday += 1;
    await user.save();

    res.json({
      message: "Assessment recorded",
      assessmentsToday: user.healthDetails.assessmentsToday,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Fetch Dashboard Stats
exports.getHealthStats = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    await resetIfNeeded(user);

    const { healthChecksToday, assessmentsToday, chatSessionsToday } =
      user.healthDetails;

    res.json({ healthChecksToday, assessmentsToday, chatSessionsToday });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Increment Chat Session Counter
exports.incrementChatSession = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    await resetIfNeeded(user);

    user.healthDetails.chatSessionsToday += 1;
    await user.save();

    res.json({
      message: "Chat session recorded",
      chatSessionsToday: user.healthDetails.chatSessionsToday,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Reset Helper Function
const resetIfNeeded = async (user) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (user.healthDetails.lastResetAt < today) {
    user.healthDetails.healthChecksToday = 0;
    user.healthDetails.assessmentsToday = 0;
    user.healthDetails.chatSessionsToday = 0;
    user.healthDetails.lastResetAt = new Date();
    await user.save();
  }
};
