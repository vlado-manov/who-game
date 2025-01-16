const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  type: { type: String, enum: ["generic", "individual"], required: true },
});

const Question = mongoose.model("Question", questionSchema);
module.exports = Question;
