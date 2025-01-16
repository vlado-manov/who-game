const mongoose = require("mongoose");

const gameSessionSchema = new mongoose.Schema({
  gameCode: { type: String, required: true, unique: true },
  players: [{ name: String, socketId: String }],
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
  gameState: {
    type: String,
    enum: ["waiting", "in-progress", "finished"],
    default: "waiting",
  },
  roundData: {
    currentRound: Number,
    questionsAnswered: [String], // Tracking players' answers
  },
});

const GameSession = mongoose.model("GameSession", gameSessionSchema);
module.exports = GameSession;
