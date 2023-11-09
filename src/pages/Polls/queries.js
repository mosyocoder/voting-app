import { gql } from "@apollo/client";

export const GET_ALL_POLLS = gql`
	subscription getAllPolls {
		polls {
			id
			title
			created_at
		}
	}
`;
