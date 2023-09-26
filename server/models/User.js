const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	username: { type: String, required: true, default: null },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	phonenumber: { type: String, required: true, unique: true },
	balance: { type: Number, default: 0.0 },
	token: { type: String },
});

module.exports = mongoose.model("User", userSchema);
