const mongoose = require("mongoose");

const botSchema = new mongoose.Schema(
  {
    Type: String,
    Thres: Number,
  },
  {
    timestamps: true,
  }
);

const Bot = mongoose.model("bot", botSchema);

module.exports = Bot;
