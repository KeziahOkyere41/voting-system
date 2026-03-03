const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/ghanaVoting");

const Voter = require("./models/Voter");
const Vote = require("./models/Vote");

let votingOpen = true;

// SOCKET REAL-TIME UPDATE
setInterval(async () => {
  if (!votingOpen) return;

  // Get presidential results
  const presResults = await Vote.aggregate([
    {
      $group: {
        _id: { president: "$president" },
        total: { $sum: 1 }
      }
    }
  ]);

  // Get MP results
  const mpResults = await Vote.aggregate([
    {
      $group: {
        _id: { mp: "$mp" },
        total: { $sum: 1 }
      }
    }
  ]);

  // Combine both
  const allResults = [...presResults, ...mpResults];
  console.log("📊 Emitting live results:", allResults);
  io.emit("liveResults", allResults);
}, 10000); // Every 10 seconds for testing

io.on("connection", (socket) => {
  console.log("👤 User Connected");
});

// AUTH ROUTE
app.post("/verify", async (req, res) => {
  const { ghanaCard } = req.body;

  const voter = await Voter.findOne({ ghanaCard });

  if (!voter) return res.json({ success: false });

  if (voter.hasVoted) return res.json({ success: false, message: "Already voted" });

  res.json({ success: true, voter });
});

// VOTE ROUTE
app.post("/vote", async (req, res) => {
  const { ghanaCard, president, mp, region } = req.body;

  const voter = await Voter.findOne({ ghanaCard });

  if (!voter || voter.hasVoted) {
    return res.json({ success: false });
  }

  await Vote.create({ ghanaCard, president, mp, region });

  voter.hasVoted = true;
  await voter.save();

  // After vote, emit updated results immediately
  const presResults = await Vote.aggregate([
    { $group: { _id: { president: "$president" }, total: { $sum: 1 } } }
  ]);

  const mpResults = await Vote.aggregate([
    { $group: { _id: { mp: "$mp" }, total: { $sum: 1 } } }
  ]);

  io.emit("liveResults", [...presResults, ...mpResults]);

  res.json({ success: true });
});

// PUBLIC RESULTS
app.get("/results", async (req, res) => {
  // Get presidential results
  const presResults = await Vote.aggregate([
    {
      $group: {
        _id: { president: "$president" },
        total: { $sum: 1 }
      }
    }
  ]);

  // Get MP results
  const mpResults = await Vote.aggregate([
    {
      $group: {
        _id: { mp: "$mp" },
        total: { $sum: 1 }
      }
    }
  ]);
  
  // Combine and send
  const allResults = [...presResults, ...mpResults];
  res.json(allResults);
});

server.listen(5000, () => console.log("🚀 Server running on port 5000"));