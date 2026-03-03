const mongoose = require("mongoose");

const voterSchema = new mongoose.Schema({
  name: String,
  ghanaCard: String,
  region: String,
  constituency: String,
  hasVoted: { type: Boolean, default: false },
  fingerprintRegistered: { type: Boolean, default: true }, // All voters have fingerprint on file
  fingerprintHash: String // In real system, this would be encrypted
});

module.exports = mongoose.model("Voter", voterSchema);