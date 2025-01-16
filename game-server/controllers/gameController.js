const { v4: uuidv4 } = require("uuid");
const GameSession = require("../models/GameSession");
const Question = require("../models/Question");

exports.createGameSession = async (req, res) => {
  const { playerName } = req.body;
  const gameCode = uuidv4();

  try {
    const newSession = new GameSession({
      gameCode,
      players: [{ name: playerName, socketId: "" }],
      gameState: "waiting",
      roundData: { currentRound: 0, questionsAnswered: [] },
    });
    await newSession.save();
    res
      .status(201)
      .json({ gameCode, message: "Game session created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error creating game session", error });
  }
};

exports.joinGameSession = async (req, res) => {
  const { gameCode, playerName } = req.body;

  try {
    const gameSession = await GameSession.findOne({ gameCode });
    if (!gameSession) {
      return res.status(404).json({ message: "Game session not found" });
    }

    gameSession.players.push({ name: playerName, socketId: "" });
    await gameSession.save();
    res
      .status(200)
      .json({ gameCode, message: "Joined game session successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error joining game session", error });
  }
};

exports.addQuestion = async (req, res) => {
  const { questionText, questionType } = req.body;

  try {
    const newQuestion = new Question({
      text: questionText,
      type: questionType,
    });
    await newQuestion.save();
    res.status(201).json({
      message: "Question added successfully",
      questionId: newQuestion._id,
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding question", error });
  }
};
