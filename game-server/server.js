const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const socketIo = require("socket.io");
const gameController = require("./controllers/gameController");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/game", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.post("/api/create-game", gameController.createGameSession);
app.post("/api/join-game", gameController.joinGameSession);
app.post("/api/add-question", gameController.addQuestion);

let gameSessions = {};

io.on("connection", (socket) => {
  console.log("Player connected:", socket.id);

  socket.on("join-session", (data) => {
    const { gameCode, playerName } = data;

    if (gameSessions[gameCode]) {
      gameSessions[gameCode].players.push({
        socketId: socket.id,
        name: playerName,
      });
    } else {
      gameSessions[gameCode] = {
        players: [{ socketId: socket.id, name: playerName }],
        state: "waiting",
      };
    }

    io.to(gameCode).emit("update-players", gameSessions[gameCode].players);
  });

  socket.on("start-game", (gameCode) => {
    if (gameSessions[gameCode]) {
      gameSessions[gameCode].state = "in-progress";
      io.to(gameCode).emit("game-started");
    }
  });

  socket.on("disconnect", () => {
    console.log("Player disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5020;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
