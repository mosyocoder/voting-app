import { Row, Col, Menu } from "antd";
import { Routes, Route, Link } from "react-router-dom";

import Polls from "./pages/Polls";
import Poll from "./pages/Poll";
import NewPoll from "./pages/NewPoll";

function App() {
	const menuItems = [
		{
			key: "/",
			label: <Link to={"/"}>Polls</Link>,
		},
		{
			key: "new",
			label: <Link to={"/newPoll"}>New Poll</Link>,
		},
	];

	return (
		<Row className="container">
			<Col className="menu">
				<Menu mode="horizontal" defaultSelectedKeys={"/"} items={menuItems}></Menu>
			</Col>
			<Col className="content">
				<Routes>
					<Route path="/" element={<Polls />} />
					<Route path="/newPoll" element={<NewPoll />} />
					<Route path="/poll/:id" element={<Poll />} />
				</Routes>
			</Col>
		</Row>
	);
}

export default App;
