const bcrypt = require("bcrypt");
// Function to hash a password
const hashPassword = async (password) => {
	const saltRounds = 10; // Number of salt rounds (adjust as needed)
	return await bcrypt.hash(password, saltRounds);
};
const usersData = [
	{
		username: "User1",
		email: "user1@example.com",
		password: await hashPassword("password1"),
		phonenumber: "1234567890",
		balance: 1000.0, // Initial balance for User1
	},
	{
		username: "User2",
		email: "user2@example.com",
		password: await hashPassword("password2"),
		phonenumber: "9876543210",
		balance: 500.0, // Initial balance for User2
	},
	{
		username: "User3",
		email: "user3@example.com",
		password: await hashPassword("password3"),
		phonenumber: "9876543211",
		balance: 10000.0, // Initial balance for User2
	},
	{
		username: "User4",
		email: "user4@example.com",
		password: await hashPassword("password4"),
		phonenumber: "9876543209",
		balance: 500000.0, // Initial balance for User2
	},
];
module.exports = usersData;
