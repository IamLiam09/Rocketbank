import React, { useState, useEffect } from "react";
import deposit from "../Homepageimages/Deposit.png";
import transfer from "../Homepageimages/transfer.png";
import withdraw from "../Homepageimages/Withdraw.png";
import logout from "../Homepageimages/logout.png";
import { Link, Redirect } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_USER_DATA_QUERY } from "../GraphQL/GetUserMutaion";
import TransactionHistory from "../Component/Transactionhistory";

function HomePage(props) {
	const { user } = props.location.state || {};
	const token = localStorage.getItem("authToken");
	const tokenExpiration = localStorage.getItem("authTokenExpiration");
	if (!token || (tokenExpiration && Date.now() > tokenExpiration)) {
		return <Redirect to="/login" />;
	}
	const [LoggedUser, setUser] = useState(props.location.state?.user);
	const [userDataFromServer, setUserDataFromServer] = useState(null);
	const [phonenumber, setPhonenumber] = useState(null);
	console.log("logged:", LoggedUser);

	const { loading, error, data } = useQuery(GET_USER_DATA_QUERY, {
		variables: { getUserDataId: LoggedUser.id },
	});
	const fetchUserData = async () => {
		try {
			const { data } = await props.client.query({
				query: GET_USER_DATA_QUERY,
				variables: { getUserDataId: user.id },
			});

			// Handle the fetched data here
			const userDataFromServer = data.getUserData;
			// Update the user data in your component's state using setUser
			setUser(userDataFromServer);
		} catch (error) {
			console.error("Error fetching user data:", error);
		}
	};

	useEffect(() => {
		if (user) {
			// Fetch user data when the component mounts
			fetchUserData();
		}
	}, [user]);

	const handleLogout = () => {
		// Clear the authentication token from localStorage
		localStorage.removeItem("authToken");
		localStorage.removeItem("authTokenExpiration");

		// Redirect the user to the login page
		props.history.push("/login");
	};

	const truncatedUsername =
		LoggedUser.username.length > 12
			? LoggedUser.username.substring(0, 12) + "..."
			: LoggedUser.username;
	const formattedBalance = user ? `₦${user.balance}` : "Loading...";
	return (
		<>
			<div className="container color bg-success px-3 py-2 mt-3 mt-md-5 rounded-4 mt-lg-5 mx-auto">
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
			<TransactionHistory
				transactions={
					userDataFromServer
						? userDataFromServer.transactions
						: LoggedUser.transactions
				}
			/>
			<div>
				<button
					className="btn hover-btn-danger text-white bg-success rounded-pill position-fixed bottom-0 end-0 m-3"
					onClick={handleLogout}
				>
					Logout
				</button>
			</div>
		</>
	);
}
export default HomePage;
