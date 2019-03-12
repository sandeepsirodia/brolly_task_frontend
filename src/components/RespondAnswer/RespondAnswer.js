import './style.scss';
import React, { Component } from 'react';
import axios from 'axios';
import baseURL from '../../request';

class RespondAnswer extends Component {
  constructor(props) {
    super(props);
    this.state={
      all_question:[],
      all_answer:[],
      active_question:{},
      token:'',
      question:'',
      answer:'',
      guess_word_id:'',
      errorState:false,
      error:false,
      winner: '',
    }
  }

  componentDidMount(){
    this.apiCall()
  }

  apiCall=()=>{
    const token = localStorage.getItem('token')
    axios.post(`${baseURL}yesnoquestion/list_question_guessed_words/`, {
        token: token,
      })
    .then(res => {
      const data = res.data;
      console.log('data',data)
      if (data.result) {
        this.setState({winner:data.winner, all_question: data.all_question, can_ask_question:data.can_ask_question, all_answer:data.all_answer, token:token, guess_word_id:data.guess_word_id, errorState:false})  
      }else{
        this.setState({error:data.errors[0], errorState:true})
      }
      
    })
  }

  
  submitHandler = (event, req) => {
    event.preventDefault();
    const { token, answer, guess_word_id, question} = this.state;
    event.target.className += ' was-validated';
    if(event.target.checkValidity()){
      if (req === 'question') {
        axios.post(`${baseURL}yesnoquestion/ask_question/`, {
            token: token,
            guess_word_id: guess_word_id,
            question: question,
          })
        .then(res => {
          const data = res.data;
          if (data.result) {
            this.apiCall()
            this.setState({errorState:false})
          }else{
            this.setState({error:data.errors[0], errorState:true})
          }
          console.log(data);
        }).catch(err => {
          console.log(err);          
        });
      }else if (req === 'answer') {
        axios.post(`${baseURL}yesnoquestion/submit_answer/`, {
            token: token,
            guess_word_id: guess_word_id,
            guess_answer: answer,
          })
        .then(res => {
          const data = res.data;
          if (data.result === 1) {
            this.apiCall()
            this.setState({errorState:false})
          }else if (data.result === 2) {
            window.location.reload()
          }else{
            this.setState({error:data.errors[0], errorState:true})
          }
          console.log(data);
        }).catch(err => {
          console.log(err);          
        });
      }
    }
  }

  endGame(){
    const token = localStorage.getItem('token')
    axios.post (`${baseURL}yesnoquestion/end_game/`, {
        "token": token
      })
    .then(res => {
      window.location.reload()
    })
  }

  changeHandler = (event, type) => {
    this.setState({...this.state, [type]:event.target.value});
  }
  
  render() {
    const {all_question, all_answer, can_ask_question, errorState, error, winner} = this.state
    return (
      <div className={'main-page row'}>
        { winner ? <div> <p>winner of last game was {winner}</p> <button className={'btn btn-primary'} onClick={()=>this.endGame()} > Okay </button></div>:
        <div>
        <div className={'col-lg-6'}>
          <h1>List of available question asked</h1>
          <h5>ask yes no question ( {all_question.length}/ 20)</h5>
          {all_question.map((question, index)=>{
            return(
              <div className={'card col-12'}><div className={'card-body'}>{index+1}. <h3 className={'card-text'}>{question.question}</h3><h6 className={'card-text'}>{question.response}</h6></div></div>
          )})}
          {can_ask_question?  <div>
            <form onSubmit={(e)=> this.submitHandler(e,'question')}>
              <input onChange={(e)=> this.changeHandler(e, 'question')}  name='question' className={'form-control'} placeholder={'type question here'} value={this.state.question} required/>
              <button type={'submit'} className={'btn btn-primary'} > Submit </button>

            </form>
          </div>:null}
        </div>
        <div className={'col-lg-6'}>
          <h1>List of available guessed word submitted</h1>
          
          {all_answer.map(answer=>{
            return(
              <div className={'card col-12'}><div className={'card-body'}><h3 className={'card-text'}>{answer.guessedanswer}</h3></div></div>
          )})}
          <h5>you can submit your answer anytime</h5>
          <div>
            <form onSubmit={(e)=> this.submitHandler(e,'answer')}>
              <input onChange={(e)=> this.changeHandler(e, 'answer')}  name='answer' className={'form-control'} placeholder={'type answer here'} value={this.state.answer} required/>
              <button type={'submit'} className={'btn btn-primary'} > Submit </button>

            </form>
          </div>
        </div>
        {errorState? <p className={'error-value'}>{error}</p>:null}</div>}
      </div>
    );
  }
}

export default RespondAnswer;
