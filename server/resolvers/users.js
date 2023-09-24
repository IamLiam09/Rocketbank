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
	},
};

module.exports = resolvers;
