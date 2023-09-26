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
		getUsers: [User]
	}
	type Transaction {
		id: ID!
		date: String!
		amount: Float!
		type: String!
		user: User!
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
	input TransferInput {
		sourcePhoneNumber: String!
		destinationPhoneNumber: String!
		amount: Float!
	}
	input DepositInput {
		phonenumber: String!
		amount: Float!
	}
	input WithdrawalInput {
		phonenumber: String!
		amount: Float!
	}
	type Mutation {
		registerUser(registerInput: RegisterInput): User
		loginUser(loginInput: LoginInput): User
		transferMoney(transferInput: TransferInput): Boolean
		depositMoney(depositInput: DepositInput): User
		withdrawalMoney(withdrawalInput: WithdrawalInput): User
		transactions(userId: ID!): [Transaction!]!
	}
`;

module.exports = typeDefs;
