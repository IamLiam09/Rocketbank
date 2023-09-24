const { GraphQLObjectType, GraphQLID, GraphQLString } = require("graphql");
const User = new GraphQLObjectType({
	name: "User",
	fields: () => ({
		id: { type: GraphQLID },
		firstName: { type: GraphQLString },
		LastName: { type: GraphQLString },
		city: { type: GraphQLString },
		phonenumber: { type: GraphQLID },
		email: { type: GraphQLString },
		password: { type: GraphQLString },
	}),
});
