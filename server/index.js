// Getting all the require modules
const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const colors = require("colors");
require("dotenv").config();
// const { graphqlHTTP } = require("express-graphql");
// const schema = require("./schema/schema");
const connectDB = require("./config/db.js");
const typeDefs = require("./schema/schema");
const resolvers = require("./resolvers/users");
const User = require("./models/User");
// Import the seeding script
const seedDatabase = require("./utlis/seed");

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
			const user = jwt.verify(token, "your-secret-key");
			req.user = user;
		}
	} catch (error) {
		console.error(error);
	}
	next();
});
async function startApolloServer() {
	const server = new ApolloServer({
		typeDefs,
		resolvers,
		context: ({ req }) => {
			return { user: req.user };
		},
	});
	await server.start();
	//   app.use(
	// 	  "/graphql",
	// 	  graphqlHTTP({
	// 		  schema,
	// 		  graphiql: process.env.NODE_ENV === "development",
	// 	  })
	//   );
	server.applyMiddleware({ app });
	// Run the seeding script
	seedDatabase();
	app.listen(port, console.log(`server is running on ${port}`));
}
startApolloServer();
