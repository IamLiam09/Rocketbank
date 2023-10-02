import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { DEPOSIT_USER_MUTATION } from "../GraphQL/DepositMutation";
import { Link, Redirect } from "react-router-dom";

function DepositForm(props) {
	const token = localStorage.getItem("authToken");
	if (!token) {
		return <Redirect to="/login" />;
	}
	const { phonenumber } = props.user;
	const [depositAmount, setDepositAmount] = useState("");
	const [message, setMessage] = useState("");
	// Use your deposit mutation and logic here
	const [depositUser] = useMutation(DEPOSIT_USER_MUTATION);

	const handleDeposit = async (e) => {
		e.preventDefault();
		console.log("serp", phonenumber);
		console.log(props);

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
					},
				},
			});
			if (data && data.depositMoney) {
				setMessage(
					`Deposit successful. New balance: ₦${data.depositMoney.balance}`
				);
			} else {
				setMessage("Deposit failed.");
			}
		} catch (error) {
			setMessage(`Deposit error: ${error.message}`);
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
			<Link to="/home" className="mt-3">
				Back to Home
			</Link>
		</div>
	);
}

export default DepositForm;
