import { gql, useQuery } from "@apollo/client";
export const GETUSER_USER_MUTATION = gql`
	query GetUser($userId: ID!) {
		user(id: $userId) {
			id
			username
			transactions {
				id
				date
				amount
				type
			}
		}
	}
`;
