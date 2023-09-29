import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { WITHDRAW_USER_MUTATION } from "../GraphQL/WithdrawMutation";
import { Link } from "react-router-dom";

function WithdrawalForm(props) {
	const { phonenumber } = props.user;
	const [withdrawalAmount, setWithdrawalAmount] = useState("");
	const [message, setMessage] = useState("");
	// Use your withdrawal mutation and logic here
	const [withdrawUser] = useMutation(WITHDRAW_USER_MUTATION);

	const handleWithdrawal = async (e) => {
		e.preventDefault();
		console.log("serp", phonenumber);
		console.log(props)
		try {
			const { data } = await withdrawUser({
				variables: {
					withdrawalInput: {
						phonenumber: phonenumber, // Replace with actual phone number
						amount: parseFloat(withdrawalAmount),
					},
				},
			});
			console.log(data.withdrawUser);

			if (data && data.withdrawalMoney) {
				setMessage(
					`Withdrawal successful. New balance: ₦${data.withdrawalMoney.balance}`
				);
			} else {
				setMessage("Withdrawal failed.");
			}
		} catch (error) {
			setMessage(`Withdrawal error: ${error.message}`);
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
			<Link to="/home" className="mt-3">
				Back to Home
			</Link>
		</div>
	);
}

export default WithdrawalForm;
