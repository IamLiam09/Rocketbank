import { gql, useQuery } from "@apollo/client";
export const GET_USER_DATA_QUERY = gql`
	query ($getUserDataId: ID!) {
		getUserData(id: $getUserDataId) {
			id
			username
			phonenumber
			balance
			token
			transactions {
				amount
				date
				type
			}
		}
	}
`;
