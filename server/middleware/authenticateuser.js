const jwt = require("jsonwebtoken");
const { AuthenticationError } = require("apollo-server-express");

const verifyToken = (req) => {
  // Get the authorization header from the request
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    throw new AuthenticationError("Authorization header is missing.");
  }

  // Extract the token from the "Bearer" token in the header
  const token = authorizationHeader.replace("Bearer ", "");

  try {
    // Verify and decode the token using your JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new AuthenticationError("Invalid or expired token.");
  }
};

module.exports = verifyToken;
