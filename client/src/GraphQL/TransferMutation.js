import { gql, useMutation } from "@apollo/client";
export const TRANSFERMONEY_USER_MUTATION = gql`
	mutation TransferMoney($transferInput: TransferInput) {
		transferMoney(transferInput: $transferInput)
	}
`;
