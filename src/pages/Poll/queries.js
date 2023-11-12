import {gql} from "@apollo/client"

export const GET_POLL = gql`
	subscription getPolls($id: Int!) {
		polls_by_pk(id: $id) {
			id
			title
			created_at
			options {
				id
				title
				votes_aggregate {
					aggregate {
						count
					}
				}
			}
		}
	}
`; 