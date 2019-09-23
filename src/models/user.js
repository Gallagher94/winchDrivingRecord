const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: false, trim: true },
    lastName: { type: String, required: false, trim: true },
    totalNumberOfTimesDriven: { type: String, required: false },
    currentCount: { type: String, required: false },
    lastDateDriven: { type: String, required: false },
    cycleStartDate: { type: String, required: false },
    cycleEndDate: { type: String, required: false },
    isQualifiedToDrive: { type: Boolean, required: false }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
