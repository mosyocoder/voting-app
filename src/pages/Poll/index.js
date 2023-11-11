import React, {useState} from "react";
import {useParams} from 'react-router-dom'
import {useSubscription} from '@apollo/client'
import { Button, Col, Progress, Radio, Row, message } from "antd";
import axios from "axios"

import { GET_POLL } from "./queries";

function Poll() {
  const id = useParams();
  const [selectedVote,setSelectedVote] = useState()
  const [isVoted,setIsVoted] = useState(false)
  
  const {data,loading,error} = useSubscription(GET_POLL,{
	  	variables:id
  })
  
  if(loading) return <div>Loading...</div>
  if(error) return <div>Error: {error}</div>
  
  const {polls_by_pk:{title,options}} = data;
  
  const de={
  	option_id:selectedVote
  }
  
  const handleVoteButton = async () => {
  	try{
  		await axios.post("https://voting-app-mosyo.hasura.app/api/rest/addvote",{data:de},
					{
						headers: {
							"x-hasura-admin-secret": process.env.REACT_APP_HASURA_ADMIN_SECRET,
						},
					},)
  	}catch(e){console.log('Error :',e)}
  }
  
  
	return <Row>
	  <Col span={24}><h1>{title}</h1></Col>
	  <Col span={24}>
	    <Radio.Group key={title}>
	      {options.map((option)=>(
	      	<div key={option.id}>
	      	{console.log(option)}
	      	  <Radio value={option.id} onChange={({target}) => setSelectedVote(target.value)}>{option.title}</Radio>
	      	</div>
	      ))}
	    </Radio.Group>
	    {!isVoted && (
	    	  <Button onClick={handleVoteButton} type="primary">Vote !</Button>
	    )}
	  </Col>
	  
	</Row>;
}

export default Poll;
