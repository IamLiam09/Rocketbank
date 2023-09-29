import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { TRANSFERMONEY_USER_MUTATION } from "../GraphQL/TransferMutation.js";
import { Link } from "react-router-dom";

function TransferForm(props) {
	const { phonenumber } = props.user;
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
		console.log("serp", phonenumber);
		console.log(props);

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
						sourcePhoneNumber: phonenumber, // Replace with actual phone number
						amount: parseFloat(formData.amount),
						destinationPhoneNumber: formData.phonenumber,
					},
				},
			});
			console.log(data.transferUser);
			if (data && data.transferMoney) {
				setMessage(
					`transfer successful`
				);
			} else {
				setMessage("transfer failed.");
			}
		} catch (error) {
			setMessage(`transfer error: ${error.message}`);
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
			<Link to="/home" className="mt-3">
				Back to Home
			</Link>
		</div>
	);
}

export default TransferForm;
