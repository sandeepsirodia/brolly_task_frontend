import '../main.scss';
import React, { Component } from 'react';
import axios from 'axios';
import baseURL from '../../request';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state={
      all_users:[],
      guessword:{},
      token:'',
      errorState:false,
      error:false,
    }
  }

  componentDidMount(){
    this.allUserApiCall()
  }

  allUserApiCall=()=>{
    const token = localStorage.getItem('token')
    axios.post(`${baseURL}user/all_users/`, {
        "token": token
      })
    .then(res => {
      const data = res.data;
      if (data.result) {
        this.setState({all_users: data.data, token:token, errorState:false})
      }else{
        this.setState({error:data.errors[0], errorState:true})
      }
    })
  }


  submitHandler = (event, guesser_id) => {
    event.preventDefault();
    const { token, guessword} = this.state;
    event.target.className += ' was-validated';
    if(event.target.checkValidity()){
      axios.post(`${baseURL}guessedword/start_game/`, {
          "token": token,
          "guesser_id": guesser_id,
          "guess_word":guessword[guesser_id],
        })
      .then(res => {
        const data = res.data;
        
        if (data.result) {
          localStorage.setItem('co_user_id', guesser_id)
          this.setState({errorState:false})
          window.location.reload()
        }else{
          this.setState({error:data.errors[0], errorState:true})
        }
      }).catch(err => {
        console.log(err);          
      });
    
    }
  }

  changeHandler = (event, pk) => {
    this.setState({...this.state, guessword: {[pk]:event.target.value}});
  }
  
  render() {
    const {all_users, errorState, error} = this.state
    console.log(this)
    return (
      <div className={'list-users-page'}>
        <h1>List of available users to play</h1>
        <h5>give them a word to guess</h5>
        {all_users.map(user=>{
          return(
            <div className={'card col-12'}><div className={'card-body'}><p className={'card-text'}>{user.name}</p><form onSubmit={(e)=> this.submitHandler(e, user.pk)} noValidate><input onChange={(e)=> this.changeHandler(e,user.pk)}  name='guessword' className={'form-control'} placeholder={'type word here'} value={this.state.guessword[user.id]} required/><button type={'submit'} className={'btn btn-primary'}>Ask</button></form></div></div>
        )})}
        {errorState? <p className={'error-value'}>{error}</p>:null}
      </div>
    );
  }
}

export default Dashboard;
