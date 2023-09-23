// Getting all the require modules
const express = require("express");
const colors = require("colors")
require("dotenv").config();
const { graphqlHTTP } = require("express-graphql");
const schema = require("./schema/schema");
const connectDB = require("./config/db.js")
// running the port from env or 5000 port
const port = process.env.PORT || 5000;
const app = express();
// connect to database
connectDB()
app.use(
	"/graphql",
	graphqlHTTP({
		schema,
		graphiql: process.env.NODE_ENV === "development",
	})
);
app.listen(port);
