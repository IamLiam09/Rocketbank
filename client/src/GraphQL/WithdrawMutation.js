import { gql, useMutation } from "@apollo/client";
export const WITHDRAW_USER_MUTATION = gql`
	mutation WithdrawalMoney($withdrawalInput: WithdrawalInput) {
		withdrawalMoney(withdrawalInput: $withdrawalInput) {
			balance
			phonenumber
		}
	}
`;
