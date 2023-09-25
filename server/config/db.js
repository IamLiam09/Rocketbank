const mongoose = require("mongoose");
const connectDB = async () => {
	const mongodbURI = process.env.MONGO_URI;

	await mongoose
		.connect(mongodbURI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})
		.then(() => {
			// cconnect db successfully
			console.log("MongoDB connected successfully");
			// Connection host
			console.log(
				`MongoDB Connected: ${mongoose.connection.host}`.cyan.underline.bold
			);
		})
		.catch((error) => {
			console.error("MongoDB connection error:", error);
		});
};

module.exports = connectDB;
