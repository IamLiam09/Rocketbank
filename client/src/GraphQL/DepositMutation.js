import { gql, useMutation } from "@apollo/client";
export const DEPOSIT_USER_MUTATION = gql`
	mutation DepositMoney($depositInput: DepositInput) {
		depositMoney(depositInput: $depositInput) {
			phonenumber
			balance
		}
	}
`;
