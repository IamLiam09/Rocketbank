import React, { useState, useEffect } from "react";
import deposit from "../Homepageimages/Deposit.png";
import transfer from "../Homepageimages/transfer.png";
import withdraw from "../Homepageimages/Withdraw.png";

function HomePage({ user }) {
	const [LoggedUser, setUser] = useState(user);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Simulate fetching user data from the server
		// Replace this with your actual data fetching logic

		const fetchData = async () => {
			try {
				// Simulate a network request with a delay
				await new Promise((resolve) => setTimeout(resolve, 2000));

				const userData = {
					username: LoggedUser?.username || "", // Use optional chaining to handle potential null value
					balance: LoggedUser?.balance || 0, // Provide a default value for balance
				};

				setUser(userData);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching user data:", error);
				// Handle error here (e.g., set an error state)
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	if (loading) {
		return <p className="text-white">Loading...</p>;
	}

	const truncatedUsername =
		LoggedUser.username.length > 12
			? LoggedUser.username.substring(0, 12) + "..."
			: LoggedUser.username;
	const formattedBalance = `₦${LoggedUser.balance}`;

	const handleColumnClick = (action) => {
		// Handle click based on the action (e.g., "Deposit", "Transfer", "Withdraw")
		console.log(`${action} clicked`);
	};

	return (
		<div className="container color bg-success px-3 py-2 mt-5 rounded-4">
			<div className="flex-column align-items-start py-3 px-4">
				<p className="mt-0 mb-0 text-white">
					Welcome,{" "}
					{LoggedUser.username.length > 12 ? (
						<span title={LoggedUser.username}>{truncatedUsername}</span>
					) : (
						LoggedUser.username
					)}
					!
				</p>
				<h1 className="mt-0 text-white">{formattedBalance}</h1>
			</div>
			<div className="d-flex justify-content-evenly">
				<div
					className="w-10 d-flex flex-column align-items-center"
					onClick={() => handleColumnClick("Deposit")}
				>
					<img src={deposit} alt="deposit image" className="w-25 !important" />
					<p className="text-white cursor-pointer user-select-none">Deposit</p>
				</div>
				<div
					className="w-5 d-flex flex-column align-items-center"
					onClick={() => handleColumnClick("Transfer")}
				>
					<img src={transfer} alt="transfer image" className="w-25" />
					<p className="text-white cursor-pointer user-select-none">Transfer</p>
				</div>
				<div
					className="w-5 d-flex flex-column align-items-center cursor-pointer"
					onClick={() => handleColumnClick("Withdraw")}
				>
					<img src={withdraw} alt="withdraw image" className="w-25" />
					<p className="text-white cursor-pointer user-select-none">Withdraw</p>
				</div>
			</div>
		</div>
	);
}

export default HomePage;
