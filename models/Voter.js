const mongoose = require("mongoose");

const voterSchema = new mongoose.Schema({
  name: String,
  ghanaCard: String,
  region: String,
  constituency: String,
  hasVoted: { type: Boolean, default: false }
});

module.exports = mongoose.model("Voter", voterSchema);