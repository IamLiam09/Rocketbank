import { gql, useMutation } from "@apollo/client";
export const REGISTER_USER_MUTATION = gql`
	mutation RegisterUser($registerInput: RegisterInput) {
		registerUser(registerInput: $registerInput) {
			username
			phonenumber
			balance
			token
			id
			transactions {
				amount
				date
				type
			}
		}
	}
`;
