const mongoose = require("mongoose");
const User = require("./User"); // Import the Transaction model

const transactionSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  amount: { type: Number, required: true },
  type: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to the User model
});

module.exports = mongoose.model("Transaction", transactionSchema);
