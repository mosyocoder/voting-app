import React from "react";
import { Form, Input, Button } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function NewPoll() {
	const navigate = useNavigate();
	const sendPoll = async (values) => {
		const filledOptions = [];

		values.options.map((opt) => {
			if (opt !== "") {
				filledOptions.push({
					title: opt,
				});
			}
		});

		const data = {
			title: values.poll_question,
			options: {
				data: filledOptions,
			},
		};

		try {
			await axios
				.post(
					"https://voting-app-mosyo.hasura.app/api/rest/addpoll",
					{
						data,
					},
					{
						headers: {
							"x-hasura-admin-secret": process.env.REACT_APP_HASURA_ADMIN_SECRET,
						},
					},
				)
				.finally(() => {
					navigate("/");
				});
		} catch (e) {
			console.log(e.message);
		}

		console.log(data);
	};

	return (
		<Form name="vote_form" onFinish={sendPoll} labelCol={{ span: 6 }} wrapperCol={{ span: 24 }} style={{ maxWidth: 1000 }}>
			<Form.Item
				name="poll_question"
				label="Poll Question"
				rules={[
					{
						required: true,
						message: "Please enter a question!",
					},
				]}>
				<Input />
			</Form.Item>

			<Form.List
				name="options"
				initialValue={["", ""]} // Başlangıçta 2 boş seçenek olacak
			>
				{(fields, { add }) => (
					<>
						{fields.map(({ key, name, ...restField }) => (
							<Form.Item
								{...restField}
								name={[name]}
								key={key}
								label={`Option ${key + 1}`} // İlk iki seçenek için A ve B etiketleri, sonra artarak devam eder
								rules={[
									{
										required: key < 2 ? true : false,
										message: "Please enter an option!",
									},
								]}>
								<Input onClick={() => (fields.length === key + 1 ? add("") : "")} onFocus={() => (fields.length === key + 1 ? add("") : "")} />
							</Form.Item>
						))}
					</>
				)}
			</Form.List>

			<Form.Item style={{ float: "right" }}>
				<Button type="primary" htmlType="submit">
					Submit
				</Button>
			</Form.Item>
		</Form>
	);
}

export default NewPoll;
