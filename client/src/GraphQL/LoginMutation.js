import { gql, useMutation } from "@apollo/client";
export const LOGIN_USER_MUTATION = gql`
	mutation LoginUser($loginInput: LoginInput) {
		loginUser(loginInput: $loginInput) {
			username
			phonenumber
			balance
		}
	}
`;
