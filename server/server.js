const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Combined User Routes (for auth + profile)
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes); // all endpoints under /api/auth/*

const healthRoutes = require("./routes/healthRoutes");
app.use("/api/health", healthRoutes);

app.post("/api/analyze", async (req, res) => {
  const { textInput } = req.body;
  try {
    const response = await axios.post("http://localhost:5001/analyze", {
      textInput,
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error analyzing:", error.message);
    console.error("Full error:", error.response?.data || error); // 👈 add this

    res.status(500).json({ error: "Failed to analyze" });
  }
});

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(5000, () =>
      console.log("Server running on http://localhost:5000")
    );
  })
  .catch((err) => console.log(err));
