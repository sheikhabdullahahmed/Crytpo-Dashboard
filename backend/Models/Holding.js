const mongoose = require("mongoose");

const holdingSchema = new mongoose.Schema({
  userId: String,
  coinId: String,
  symbol: String,
  amount: Number,
  buyPrice: Number,
});

module.exports = mongoose.model("Holding", holdingSchema);