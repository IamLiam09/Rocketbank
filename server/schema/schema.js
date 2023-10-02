const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    username: String!
    email: String!
    password: String!
    phonenumber: String!
    token: String!
    balance: Float!
    transactions: [Transaction]
  }

  type Query {
    user(id: ID!): User
    getUsers: [User]
    getUserData: User
    transactions(userId: ID!): [Transaction]
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

  type Transaction {
    id: ID!
    date: String!
    amount: Float!
    type: TransactionType!
    user: User!
  }

  input TransferInput {
    sourcePhoneNumber: String!
    destinationPhoneNumber: String!
    amount: Float!
    type: TransactionType!
  }

  input DepositInput {
    phonenumber: String!
    amount: Float!
    type: TransactionType!
  }

  input WithdrawalInput {
    phonenumber: String!
    amount: Float!
    type: TransactionType!
  }

  enum TransactionType {
    DEPOSIT
    WITHDRAWAL
    TRANSFER
  }

  input TransactionInput {
    date: String!
    amount: Float!
    type: TransactionType!
    userId: ID! 
  }

  type Mutation {
    registerUser(registerInput: RegisterInput): User
    loginUser(loginInput: LoginInput): User
    transferMoney(transferInput: TransferInput): Boolean
    depositMoney(depositInput: DepositInput): User
    withdrawalMoney(withdrawalInput: WithdrawalInput): User
    transactions(userId: ID!): [Transaction!]!
    createTransaction(transactionInput: TransactionInput): Transaction
  }
`;

module.exports = typeDefs;
