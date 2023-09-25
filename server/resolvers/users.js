const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.js");
const { ApolloError } = require("apollo-server-express");

const resolvers = {
	Query: {
		user: ({ user }) => {
			// Return the currently authenticated user
			user.findById(ID);
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
				// Hash the password
				const hashedPassword = await bcrypt.hash(password, 10);

				// Create a new user in the database
				const user = new User({
					username,
					email: email.toLowerCase(),
					password: hashedPassword,
					phonenumber,
					balance,
				});

				// Generate a JWT token
				const token = jwt.sign(
					{ userId: user._id, email },
					process.env.JWT_SECRET,
					{
						expiresIn: "1h",
					}
				);
				user.token = token;
				// save the user
				await user.save();

				// Attempt to insert the new user
				// Registration successful
				return { phonenumber: user.phonenumber };
			} catch (error) {
				if (
					error.code === 11000 &&
					error.keyPattern &&
					error.keyPattern.phonenumber === 1
				) {
					// Phone number already exists, return an error message
					throw new ApolloError(
						`Account has already been created with these credentials`
					);
				} else {
					// Handle other errors
					throw new ApolloError(
						`Account has already been created with these credentials`
					);
				}
			}
		},
		async loginUser(_, { loginInput: { email, password } }) {
			// Find the user by email
			const user = await User.findOne({ email });

			if (!user) {
				throw new ApolloError("Incorrect password or email");
			}

			// Compare the provided password with the hashed password
			const isPasswordValid = await bcrypt.compare(password, user.password);
			if (user && isPasswordValid) {
				// Generate a JWT token
				const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
					expiresIn: "1h",
				});
				// Attach token to user model that we found
				user.token = token;
				return { id: user.id, ...user._doc };
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
				});
				const destinationUser = await User.findOne({
					phonenumber: destinationPhoneNumber,
				});

				if (!sourceUser || !destinationUser) {
					throw new Error("Account number not found");
				}

				// Verify source user has sufficient funds, deduct from source, and add to destination
				if (sourceUser.balance < amount) {
					throw new Error("Insufficient funds");
				}

				// Perform the money transfer
				sourceUser.balance -= amount;
				destinationUser.balance += amount;

				// Save the updated user data to the database
				await sourceUser.save();
				await destinationUser.save();

				return true; // Return true to indicate a successful transfer
				// Handle errors, including insufficient funds or invalid user IDs
			} catch (error) {
				throw new Error(`Error transferring money: ${error.message}`);
			}
		},
		async depositMoney(_, { transferInput: { phoneNumber, amount } }) {
			try {
				const user = await User.findOne({ phoneNumber });
				if (!user) {
					throw new Error("Account number found");
				}

				user.balance += amount;
				await user.save();

				return {
					username: user.username,
					phoneNumber: user.phonenumber,
					balance: user.balance,
				};
			} catch (error) {
				throw new Error(`Error depositing money: ${error.message}`);
			}
		},
		async withdrawalMoney(_, { withdrawInput: { phoneNumber, amount } }) {
			try {
				const user = await User.findOne({ phoneNumber });
				if (!user) {
					throw new Error("Account Number not found");
				}

				if (user.balance < amount) {
					throw new Error("Insufficient funds");
				}

				user.balance -= amount;
				await user.save();

				return user;
			} catch (error) {
				throw new Error(`Error withdrawing money: ${error.message}`);
			}
		},
	},
};

module.exports = resolvers;
