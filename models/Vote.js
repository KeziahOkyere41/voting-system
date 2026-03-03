const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema({
  ghanaCard: String,
  president: String,
  mp: String,
  region: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Vote", voteSchema);