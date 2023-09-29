// Getting all the require modules
const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const colors = require("colors");
require("dotenv").config();
// const { graphqlHTTP } = require("express-graphql");
const connectDB = require("./config/db.js");
const typeDefs = require("./schema/schema");
const resolvers = require("./resolvers/users");
const User = require("./models/User");
const verifyToken = require("./middleware/authenticateuser"); 
const cors = require("cors")

// running the port from env or 5000 port
const port = process.env.PORT || 5000;
const app = express();
// connect to database
connectDB();
// Middleware to extract and verify JWT tokens
app.use(async (req, res, next) => {
	const token = req.headers.authorization || "";
	try {
		if (token) {
			const user = verifyToken(req);
			req.user = user;
		}
	} catch (error) {
		console.error(error);
	}
	next();
});
app.use(cors())
app.get("/", (req, res) => {
	res.setHeader("Access-Control-Allow-Credentials", "true")
	res.send("Api is running...")
})
async function startApolloServer() {
	const server = new ApolloServer({
		typeDefs,
		resolvers,
		context: ({ req }) => ({ req }),
	});
	await server.start();
	server.applyMiddleware({ app });
	// Run the seeding script
	app.listen(port, console.log(`server is running on ${port}`));
}
startApolloServer();
