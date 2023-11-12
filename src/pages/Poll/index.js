import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useSubscription } from "@apollo/client";
import { Badge, Button, Col, Radio, Row } from "antd";
import axios from "axios";

import { GET_POLL } from "./queries";

function Poll() {
	const id = useParams();
	const [selectedVote, setSelectedVote] = useState();
	const [isVoted, setIsVoted] = useState(false);

	const { data, loading, error } = useSubscription(GET_POLL, {
		variables: id,
	});

	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error: {error}</div>;

	const {
		polls_by_pk: { title, options },
	} = data;

	const totalVote = options.reduce((t, value) => t + value.votes_aggregate.aggregate.count, 0);

	const handleVoteButton = async () => {
		if (selectedVote) {
			try {
				await axios
					.post(
						`https://${process.env.REACT_APP_HASURA_LINK}/api/rest/addvote`,
						{ data: { option_id: selectedVote } },
						{
							headers: {
								"x-hasura-admin-secret": process.env.REACT_APP_HASURA_ADMIN_SECRET,
							},
						},
					)
					.finally(() => {
						setIsVoted(true);
						setSelectedVote("");
					});
			} catch (e) {
				console.log("Error :", e);
			}
		}
	};

	return (
		<Row>
			<Col span={24} className="header">
				<h1>{title}</h1>
				<div>
					<label htmlFor="badge">Total Votes</label>
					<Badge id="badge" title="Total Votes" count={totalVote}></Badge>
				</div>
			</Col>
			<Col span={24} className="pollContent">
				<Radio.Group key={title} style={{ display: "flex", flexDirection: "column" }}>
					{options.map((option) => (
						<div className="icerik" style={{ display: "flex" }} key={option.id}>
							<Radio value={option.id} disabled={isVoted} style={{ marginBottom: "10px" }} onChange={({ target }) => setSelectedVote(target.value)}>
								{option.title}
							</Radio>
							{isVoted && (
								<>
									<progress value={option.votes_aggregate.aggregate.count} max={totalVote}></progress>
									<span className="votesDetail">%{((option.votes_aggregate.aggregate.count * 100) / (totalVote === 0 ? 1 : totalVote)).toFixed(2)}</span>
								</>
							)}
						</div>
					))}
				</Radio.Group>
			</Col>
			{!isVoted && (
				<div className="voteButton">
					<Button onClick={handleVoteButton} type="primary">
						Oy Ver!
					</Button>
				</div>
			)}
		</Row>
	);
}

export default Poll;
