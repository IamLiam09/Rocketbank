import React, { useState, useEffect } from "react";
import deposit from "../Homepageimages/Deposit.png";
import transfer from "../Homepageimages/transfer.png";
import withdraw from "../Homepageimages/Withdraw.png";
import { Link, Redirect } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_USER_DATA_QUERY } from "../GraphQL/GetUserMutaion";

function HomePage(props) {
	const token = localStorage.getItem("authToken");
	if (!token) {
		return <Redirect to="/login" />;
	}
	const [LoggedUser, setUser] = useState(props.location.state?.user);
	const [userDataFromServer, setUserDataFromServer] = useState(null); 
	const [phonenumber, setPhonenumber] = useState(null); 
	if (!LoggedUser) {
		return <p className="text-white">Loading...</p>;
	}

	const { loading, error, data } = useQuery(GET_USER_DATA_QUERY, {
		variables: { getUserDataId: LoggedUser.id },
	});
	// console.log("LoggedUser", LoggedUser);
	// console.log("serverloading", loading);
	// console.log("error", error);
	useEffect(() => {
		if (data) {
			// Handle the fetched data here
			const userDataFromServer = data.getUserData;

			// Do something with the data, if needed
			console.log("inside", userDataFromServer);
			localStorage.setItem("userDataFromServer", JSON.stringify(userDataFromServer));
			setPhonenumber(userDataFromServer.phonenumber);

		}
	}, [loading, error, data]);

	if (loading) {
		return <p className="text-white">Loading...</p>;
	}

	const truncatedUsername =
		LoggedUser.username.length > 12
			? LoggedUser.username.substring(0, 12) + "..."
			: LoggedUser.username;
	const formattedBalance = `₦${LoggedUser.balance}`;

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
				<div className="w-5 d-flex flex-column align-items-center cursor-pointer">
					<Link
						to={{
							pathname: "/home/deposit",
							state: { phonenumber: LoggedUser.phonenumber },
						}}
						className="d-flex flex-column align-items-center"
						style={{ textDecoration: "none" }}
					>
						<img src={deposit} alt="withdraw image" className="w-25" />
						<p className="text-white cursor-pointer user-select-none">
							Deposit
						</p>
					</Link>
				</div>
				<div className="w-5 d-flex flex-column align-items-center cursor-pointer">
					<Link
						to={{
							pathname: "/home/transfer",
							state: { phonenumber: LoggedUser.phonenumber },
						}}
						className="d-flex flex-column align-items-center"
						style={{ textDecoration: "none" }}
					>
						<img src={transfer} alt="withdraw image" className="w-25" />
						<p className="text-white cursor-pointer user-select-none">
							Transfer
						</p>
					</Link>
				</div>
				<div className="w-5 d-flex flex-column align-items-center cursor-pointer">
					<Link
						to={{
							pathname: "/home/withdraw",
							state: { phonenumber: LoggedUser.phonenumber }, // Pass phonenumber as state
						}}
						className="d-flex flex-column align-items-center"
						style={{ textDecoration: "none" }}
					>
						<img src={withdraw} alt="withdraw image" className="w-25" />
						<p className="text-white cursor-pointer user-select-none">
							Withdraw
						</p>
					</Link>
				</div>
			</div>
		</div>
	);
}

export default HomePage;
