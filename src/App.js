import React, { Component } from 'react';
import Routes from './Routes';

import './app.css';
import axios from 'axios';
import baseURL from './request';

class App extends Component {

	componentDidMount(){
	    this.verifyUser()
	}

	verifyUser(){
	    const token = localStorage.getItem('token')
	    axios.post (`${baseURL}user/verify_user/`, {
	        "token": token
	      })
	    .then(res => {
	      const data = res.data;
	      this.handleTokenResponse(data)
	    })
	  }

	handleTokenResponse(data){
	    if (data.result) {
	      if (data.data.in_game) {
	        if (data.data.user_type === 'ask') {
	          this.props.history.push('/yes-no-question')
	        }else if (data.data.user_type === 'guess') {
	          this.props.history.push('/submit-answer')
	        }
	      }else{
	      	this.props.history.push('/dashboard')
	      }
	    }else{
	    	this.props.history.push('/')
	    }
	}
	render() {
	    return (
        	<Routes/>
	    );
	  }
}

export default App;
