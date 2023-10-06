import { React, useEffect } from "react";
import { format, parseISO } from "date-fns";
import styles from "../style/index.css";

const TransactionHistory = ({ transactions }) => {
	// Reverse the order of transactions
  const reversedTransactions = [...transactions].reverse();
  console.log(transactions)
	useEffect(() => {
	}, [transactions]);

	return (
		<div className="px-2 px-md-5 py-1 mt-3 mt-md-5 rounded-4 mt-lg-5 mx-auto">
			<div className="py-1 px-2 px-md-5">
				<h2 className="">Transactions</h2>
				<div className="transaction-list-container">
					<ol className="list-group">
						{reversedTransactions.map((transaction, index) => {
							let transactionDate;

							// Check if the date is in milliseconds (assuming it's a timestamp)
							if (!isNaN(transaction.date)) {
								transactionDate = new Date(parseInt(transaction.date));
							} else {
								// Attempt to parse the date as ISO
								transactionDate = parseISO(transaction.date);
							}

							// Check if the parsed date is valid
							if (isNaN(transactionDate.getTime())) {
								console.error(`Invalid date: ${transaction.date}`);
								return null; // Skip rendering this transaction
							}

							// Split the transaction type into parts
							const typeParts = transaction.type.split(" ");
							// Determine if the transaction type contains "Withdrawal"
							const isWithdrawal = typeParts.includes("Withdrawal");
							// Format the date as a string (e.g., "January 1, 2023")
							const formattedDate = transactionDate.toLocaleDateString();

							return (
								<li
									key={index}
									className={`list-group-item d-flex justify-content-between text-break text-wrap`}
								>
									<div>
										<strong>{transaction.type}</strong>
										<br />
										<strong>Date:</strong> {formattedDate}
									</div>
									<div>₦{transaction.amount}</div>
								</li>
							);
						})}
					</ol>
				</div>
			</div>
		</div>
	);
};

export default TransactionHistory;
