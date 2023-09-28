const jwt = require("jsonwebtoken");
const { AuthenticationError } = require("apollo-server-express");

const verifyToken = (req) => {
	const authorizationHeader = req.body.token || req.query.token;
	if (!authorizationHeader) {
		console.log(authorizationHeader);
		throw new AuthenticationError("Authorization header is missing.");
	}

	const token = authorizationHeader.replace("Bearer ", "");

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		return decoded;
	} catch (error) {
		throw new AuthenticationError("Invalid or expired token.");
	}
};

module.exports = verifyToken;
