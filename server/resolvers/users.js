const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.js");
const { ApolloError } = require("apollo-server-express");
const Transaction = require("../models/Transaction.js");
const authenticateUser = require("../middleware/authenticateuser");

const resolvers = {
	Query: {
		user: async (_, { id }) => {
			try {
				// Find the user by ID and return it
				const user = await User.findById(id).populate("transactions");
				return user;
			} catch (error) {
				// Handle errors if the user is not found or other issues
				console.error("Error fetching user:", error);
				return null; // Return null or handle the error as needed
			}
		},
		getUsers: async (_, { id }) => {
			try {
				// Implement logic to retrieve a list of users, possibly filtered by ID
				const users = await User.find({ _id: id }).populate("transactions"); // Example: Find users by ID
				return users;
			} catch (error) {
				throw new Error(`Error fetching users: ${error.message}`);
			}
		},
		getUserData: async (_, { id }) => {
			try {
				// Implement logic to retrieve a single user by ID
				const user = await User.findById(id).populate("transactions"); // Example: Find a user by ID
				return user;
			} catch (error) {
				throw new Error(`Error fetching user data: ${error.message}`);
			}
		},
	},

	Mutation: {
		async registerUser(
			_,
			{ registerInput: { username, email, password, phonenumber } }
		) {
			// See if the old user exists with email attempting to register
			// see if the phonenumber has been used
			try {
				const oldUser = await User.findOne({ email });
				const usedNumber = await User.findOne({ phonenumber });
				if (oldUser || usedNumber) {
					// Phone number already exists, return an error message
					throw new ApolloError(
						`Account has already been created with these credentials`
					);
				}
				// Hash the password
				const hashedPassword = await bcrypt.hash(password, 10);
				const balance = 0.0; // Define and set an initial balance
				// Create a new user in the database
				const user = new User({
					username,
					email: email.toLowerCase(),
					password: hashedPassword,
					phonenumber,
					balance,
					transactions: [],
				});

				// Generate a JWT token
				const token = jwt.sign(
					{ userId: user._id, email },
					process.env.JWT_SECRET,
					{
						expiresIn: "10m",
					}
				);
				user.token = token;
				// save the user
				await user.save();

				// Attempt to insert the new user
				// Registration successful
				return user;
			} catch (error) {
				throw new ApolloError(
					`Account has already been created with these credentials other`
				);
			}
		},
		async loginUser(_, { loginInput: { email, password } }) {
			// Find the user by email
			const user = await User.findOne({ email }).populate("transactions");

			if (!user) {
				throw new ApolloError("Incorrect password or email");
			}

			// Compare the provided password with the hashed password
			const isPasswordValid = await bcrypt.compare(password, user.password);
			if (user && isPasswordValid) {
				// Generate a JWT token
				const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
					expiresIn: "10m",
				});
				// Attach token to user model that we found
				user.token = token;
				return { id: user.id, ...user._doc, token };
			}

			if (!isPasswordValid) {
				throw new ApolloError("Incorrect password or email");
			}
		},
		async transferMoney(
			_,
			{ transferInput: { sourcePhoneNumber, destinationPhoneNumber, amount } }
		) {
			// Implement logic for transferring money here
			try {
				// Find the source and destination users by phone numbers
				const sourceUser = await User.findOne({
					phonenumber: sourcePhoneNumber,
				}).populate("transactions");

				const destinationUser = await User.findOne({
					phonenumber: destinationPhoneNumber,
				}).populate("transactions");

				if (!sourceUser || !destinationUser) {
					console.log(sourceUser);
					console.log(destinationUser);
					throw new ApolloError("Account number not found");
				}

				// Verify source user has sufficient funds, deduct from source, and add to destination
				if (sourceUser.balance < amount) {
					throw new ApolloError("Insufficient funds");
				}

				// Perform the money transfer
				sourceUser.balance -= amount;
				destinationUser.balance += amount;

				// Save the updated user data to the database
				await sourceUser.save();
				await destinationUser.save();

				// Create a transfer transaction
				const transferTransaction = new Transaction({
					date: new Date().toISOString(),
					amount,
					type: "TRANSFER",
					user: sourceUser._id,
				});

				await transferTransaction.save();

				sourceUser.transactions.push(transferTransaction);
				destinationUser.transactions.push(transferTransaction);

				await sourceUser.save();
				await destinationUser.save();

				return sourceUser;
				// Handle errors, including insufficient funds or invalid user IDs
			} catch (error) {
				throw new Error(`${error.message}`);
			}
		},
		async depositMoney(_, { depositInput: { phonenumber, amount } }, context) {
			// Authenticate the user
			// const user = authenticateUser(context.req);
			try {
				const existingUser = await User.findOne({ phonenumber }).populate(
					"transactions"
				);

				if (!existingUser) {
					throw new Error("Account number not found");
				}

				existingUser.balance += amount;
				await existingUser.save();

				// Create a deposit transaction
				const depositTransaction = new Transaction({
					date: new Date().toISOString(),
					amount,
					type: "DEPOSIT",
					user: existingUser._id,
				});
				await depositTransaction.save();

				existingUser.transactions.push(depositTransaction);

				await existingUser.save();

				return existingUser;
			} catch (error) {
				throw new Error(`${error.message}`);
			}
		},
		async withdrawalMoney(
			_,
			{ withdrawalInput: { phonenumber, amount } },
			context
		) {
			// const user = authenticateUser(context.req);
			try {
				const existingUser = await User.findOne({ phonenumber }).populate(
					"transactions"
				);
				if (!existingUser) {
					throw new Error("Account Number not found");
				}

				if (existingUser.balance < amount) {
					throw new Error("Insufficient funds");
				}

				existingUser.balance -= amount;
				await existingUser.save();
				// Create a deposit transaction
				const withdrawalTransaction = new Transaction({
					date: new Date().toISOString(),
					amount,
					type: "WITHDRAWAL",
					user: existingUser._id,
				});

				await withdrawalTransaction.save();
				existingUser.transactions.push(withdrawalTransaction);
				await existingUser.save();
				return existingUser;
			} catch (error) {
				throw new Error(`${error.message}`);
			}
		},
		async createTransaction(_, { transactionInput }) {
			try {
				// Create a new transaction in the database
				const newTransaction = new TransactionModel({
					date: transactionInput.date,
					amount: transactionInput.amount,
					type: transactionInput.type,
					user: transactionInput.userId, // Assuming you pass the user ID in the input
				});

				await newTransaction.save();

				return newTransaction;
			} catch (error) {
				throw new Error(`Error creating transaction: ${error.message}`);
			}
		},
		async transactions(_, { userId }, context) {
			try {
				const transactions = await TransactionModel.find({ userId });
				return transactions;
			} catch (error) {
				throw new Error("Failed to fetch transactions: " + error.message);
			}
		},
	},
};

module.exports = resolvers;
