import React from "react";
import { useSubscription } from "@apollo/client";
import { Badge, Space, Table } from "antd";
import { Link } from "react-router-dom";
import { RightOutlined } from "@ant-design/icons";

import { GET_ALL_POLLS } from "./queries";
import Column from "antd/es/table/Column";
import moment from "moment/moment";

function Polls() {
	const { data, loading, error } = useSubscription(GET_ALL_POLLS);

	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error:{error.message}</div>;

	const pollData = [];

    data.polls.forEach((item) => {
		const date = moment(item.created_at);
		var totalVotes = 0;
		item.options.forEach((vote) => {
			totalVotes += vote.votes_aggregate.aggregate.count;
		});
		pollData.push({
			id: item.id,
			title: item.title,
			created_at: date.format("MMMM Do YYYY, h:mm:ss a"),
			totalVotes,
		});
    });

    return (
		<Table dataSource={pollData} pagination={false} rowKey="id" bordered={true} className="table">
			<Column title="Title" key="title" dataIndex="title" />
			<Column align="center" title="Created at" key="created_at" dataIndex="created_at" />
			<Column align="center" title="Total Votes" key="total_votes" render={(item) => (item.totalVotes === 0 ? <>No votes yet.</> : <Badge count={item.totalVotes} />)} />
			<Column
				align="center"
				title="Action"
				key="action"
				render={(item) => (
					<Space size="middle" align="center">
						<Link to={`poll/${item.id}`}>
							<RightOutlined />
						</Link>
					</Space>
				)}
			/>
		</Table>
    );
}

export default Polls;
