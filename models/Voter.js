const mongoose = require("mongoose");

const voterSchema = new mongoose.Schema({
  name: String,
  ghanaCard: String,
  region: String,
  constituency: String,
  hasVoted: { type: Boolean, default: false },
  fingerprintRegistered: { type: Boolean, default: true },
  fingerprintHash: String
});

module.exports = mongoose.model("Voter", voterSchema);