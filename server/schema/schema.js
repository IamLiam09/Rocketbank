const { gql } = require("apollo-server-express");

const typeDefs = gql`
	type User {
		username: String!
		email: String!
		password: String!
		phonenumber: String!
		token: String!
		balance: Float!
	}
	type Query {
		user(id: ID!): User
	}
	input RegisterInput {
		username: String!
		email: String!
		password: String!
		phonenumber: String!
	}
	input LoginInput {
		email: String!
		password: String!
	}
	type Mutation {
		registerUser(registerInput: RegisterInput): User
		loginUser(loginInput: LoginInput): User
	}
`;

module.exports = typeDefs;
