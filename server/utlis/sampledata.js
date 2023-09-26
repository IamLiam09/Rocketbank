const bcrypt = require("bcryptjs");

// Function to hash a password

const usersData = [
	{
		username: "User1",
		email: "user1@example.com",
		password: "12345",
		phonenumber: "1234567890",
		balance: 1000.0, // Initial balance for User1
	},
	{
		username: "User2",
		email: "user2@example.com",
		password: "123",
		phonenumber: "9876543210",
		balance: 500.0, // Initial balance for User2
	},
	// Add more users here...
];

module.exports = usersData;
