const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "counselor", "ngo"],
      required: true,
    },

    // Profile Details
    avatar: { type: String },
    phoneNumber: { type: String },
    dateOfBirth: { type: Date },
    gender: {
      type: String,
      enum: ["Male", "Female", "Non-binary", "Prefer not to say"],
    },
    address: {
      line1: String,
      line2: String,
      city: String,
      state: String,
      postalCode: String,
    },
    emergencyContact: {
      name: String,
      relationship: {
        type: String,
        enum: ["Spouse", "Parent", "Sibling", "Child", "Friend", "Other"],
      },
      phoneNumber: String,
      email: String,
    },
    currentMedication: { type: String },
    allergies: { type: String },
    therapistName: { type: String },
    insuranceProvider: { type: String },
    emergencyMedicalConditions: { type: String },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;
