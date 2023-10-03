import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { DEPOSIT_USER_MUTATION } from "../GraphQL/DepositMutation";
import { Link, Redirect, useHistory } from "react-router-dom";

function DepositForm(props) {
	const history = useHistory();
	const token = localStorage.getItem("authToken");
	const tokenExpiration = localStorage.getItem("authTokenExpiration");

	// Redirect to login if no token or token is expired
	if (!token || (tokenExpiration && Date.now() > tokenExpiration)) {
		return <Redirect to="/login" />;
	}

	// Redirect to login if user is not available
	if (!props.user) {
		return <Redirect to="/login" />;
	}

	// Extract user and phonenumber from props
	const { user } = props;
	const { phonenumber } = user;

	// State to manage deposit amount and message
	const [depositAmount, setDepositAmount] = useState("");
	const [message, setMessage] = useState("");

	// GraphQL mutation hook for deposit
	const [depositUser] = useMutation(DEPOSIT_USER_MUTATION);

	// Event handler for deposit button click
	const handleDeposit = async (e) => {
		e.preventDefault();

		// Check if the depositAmount is greater than $100
		if (parseFloat(depositAmount) > 100) {
			setMessage("You can only deposit up to $100.");
			return;
		}

		try {
			const { data } = await depositUser({
				variables: {
					depositInput: {
						phonenumber: phonenumber, // Replace with actual phone number
						amount: parseFloat(depositAmount),
						type: "DEPOSIT",
					},
				},
			});

			if (data && data.depositMoney) {
				setMessage(
					`Deposit successful. New balance: ₦${data.depositMoney.balance}`
				);

				// Update the user with the new balance
				const updatedUser = {
					...user, // Use the user from props
					balance: data.depositMoney.balance,
				};

				// Navigate back to home with updated user data
				setTimeout(() => {
					history.push("/home", { user: updatedUser });
				}, 500);
			} else {
				setMessage("Deposit failed.");
			}
		} catch (error) {
			setMessage(`${error.message}`);
		}
	};

	return (
		<div className="container">
			<h2 className="mt-5">Deposit</h2>
			{message && <p className="text-success">{message}</p>}
			<form onSubmit={handleDeposit}>
				<div className="form-group">
					<label htmlFor="depositAmount">Deposit Amount (₦):</label>
					<input
						type="number"
						id="depositAmount"
						className="form-control"
						value={depositAmount}
						onChange={(e) => setDepositAmount(e.target.value)}
						required
					/>
				</div>
				<button type="submit" className="btn btn-primary mt-3">
					Deposit
				</button>
			</form>
			<Link
				to={{
					pathname: "/home",
					state: {
						user: user, // Pass the user data back to the home page
					},
				}}
				className="mt-3"
			>
				Back to Home
			</Link>
		</div>
	);
}

export default DepositForm;
