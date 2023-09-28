import { gql, useMutation } from "@apollo/client";
export const REGISTER_USER_MUTATION = gql`
	mutation RegisterUser($registerInput: RegisterInput) {
		registerUser(registerInput: $registerInput) {
			username
			email
			phonenumber
			balance
		}
	}
`;
