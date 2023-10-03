import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { WITHDRAW_USER_MUTATION } from "../GraphQL/WithdrawMutation";
import { Link, Redirect, useHistory } from "react-router-dom";

function WithdrawalForm(props) {
	const history = useHistory();
	const token = localStorage.getItem("authToken");
	const tokenExpiration = localStorage.getItem("authTokenExpiration");
	if (!token || (tokenExpiration && Date.now() > tokenExpiration)) {
		return <Redirect to="/login" />;
	}
	if (!props.user) {
		return <Redirect to="/login" />;
	}
	const { user } = props;
	const { phonenumber } = user;
	const [withdrawalAmount, setWithdrawalAmount] = useState("");
	const [message, setMessage] = useState("");
	// Use your withdrawal mutation and logic here
	const [withdrawUser] = useMutation(WITHDRAW_USER_MUTATION);

	const handleWithdrawal = async (e) => {
		e.preventDefault();
		try {
			const { data } = await withdrawUser({
				variables: {
					withdrawalInput: {
						phonenumber: phonenumber, // Replace with actual phone number
						amount: parseFloat(withdrawalAmount),
						type: "WITHDRAWAL",
					},
				},
			});

			if (data && data.withdrawalMoney) {
				setMessage(
					`Withdrawal successful. New balance: ₦${data.withdrawalMoney.balance}`
				);
				// Update the user with the new balance
				const updatedUser = {
					...user, // Use the user from props
					balance: data.withdrawalMoney.balance,
				};

				setTimeout(() => {
					history.push("/home", { user: updatedUser });
				}, 500);
			} else {
				setMessage("Withdrawal failed.");
			}
		} catch (error) {
			setMessage(`${error.message}`);
		}
	};

	return (
		<div className="container">
			<h2 className="mt-5">Withdraw</h2>
			{message && <p className="text-success">{message}</p>}
			<form onSubmit={handleWithdrawal}>
				<div className="form-group">
					<label htmlFor="withdrawalAmount">Withdrawal Amount (₦):</label>
					<input
						type="number"
						id="withdrawalAmount"
						className="form-control"
						value={withdrawalAmount}
						onChange={(e) => setWithdrawalAmount(e.target.value)}
						required
					/>
				</div>
				<button type="submit" className="btn btn-primary mt-3">
					Withdraw
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

export default WithdrawalForm;
