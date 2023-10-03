import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { TRANSFERMONEY_USER_MUTATION } from "../GraphQL/TransferMutation.js";
import { Link, Redirect, useHistory } from "react-router-dom";

function TransferForm(props) {
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
	const [formData, setFormData] = useState({
		amount: "",
		phonenumber: "",
	});
	const [message, setMessage] = useState("");
	// Use your transfer mutation and logic here
	const [transferUser] = useMutation(TRANSFERMONEY_USER_MUTATION);
	const [transferAmount, setTransferAmount] = useState("");
	const [accountNumber, setAccountNumber] = useState("");

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });

		// Update the corresponding state based on the input name
		if (name === "amount") {
			setTransferAmount(value);
		} else if (name === "phonenumber") {
			setAccountNumber(value);
		}
	};
	const handletransfer = async (e) => {
		e.preventDefault();

		// Check if the transferAmount is greater than $100
		// Check if the transfer amount is greater than $100
		if (parseFloat(formData.amount) > 100) {
			setMessage("You can only transfer up to ₦100.");
			return;
		}

		try {
			const { data } = await transferUser({
				variables: {
					transferInput: {
						sourcePhoneNumber: phonenumber,
						amount: parseFloat(formData.amount),
						destinationPhoneNumber: formData.phonenumber,
						type: "TRANSFER",
					},
				},
			});
			if (data && data.transferMoney) {
				setMessage(`transfer successful`);
				const updatedUser = {
					...user, // Use the user from props
					balance: data.transferMoney.balance,
				};
				setTimeout(() => {
					history.push("/home", { user: updatedUser });
				}, 500);
			} else {
				setMessage("Transfer failed.");
			}
		} catch (error) {
			setMessage(`${error.message}`);
		}
	};

	return (
		<div className="container">
			<h2 className="mt-5">Transfer</h2>
			{message && <p className="text-success">{message}</p>}
			<form onSubmit={handletransfer}>
				<div className="form-group">
					<label htmlFor="transferAmount">transfer Amount (₦):</label>
					<input
						type="number"
						name="amount"
						id="transferAmount"
						className="form-control"
						value={formData.amount} // Use formData.amount
						onChange={handleChange} // Use handleChange function
						required
					/>
				</div>
				<div className="form-group">
					<label htmlFor="accountNumber">Account Number</label>
					<input
						type="text"
						name="phonenumber"
						id="accountNumber"
						className="form-control"
						value={formData.phonenumber} // Use formData.phonenumber
						onChange={handleChange} // Use handleChange function
						required
					/>
				</div>
				<button type="submit" className="btn btn-primary mt-3">
					transfer
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

export default TransferForm;
