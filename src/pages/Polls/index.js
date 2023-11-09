import React from "react";
import { useSubscription } from "@apollo/client";
import { List } from "antd";
import VirtualList from "rc-virtual-list";
import { Link } from "react-router-dom";
import { RightOutlined } from "@ant-design/icons";

import { GET_ALL_POLLS } from "./queries";

function Polls() {
	const ContainerHeight = 600;

	const { data, loading, error } = useSubscription(GET_ALL_POLLS);

	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error:{error.message}</div>;

	return (
		<List key={"asd"}>
			<VirtualList data={data.polls} height={ContainerHeight} itemKey="poll">
				{(item) => (
					<List.Item key={item.id}>
						<List.Item.Meta
							key={item.id}
							title={
								<div className="poll_title">
									<div className="title">{item.title}</div>
									<div className="arrow">
										<Link to={`poll/${item.id}`}>
											<RightOutlined />
										</Link>
									</div>
								</div>
							}
						/>
					</List.Item>
				)}
			</VirtualList>
		</List>
	);
}

export default Polls;
