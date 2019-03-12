import './style.scss';
import React, { Component } from 'react';
import axios from 'axios';
import baseURL from '../../request';

class YesNoQuestion extends Component {
  constructor(props) {
    super(props);
    this.state={
      all_question:[],
      active_question:{},
      token:'',
      new_question:{},
      errorState:false,
      error:false,
      winner:'',
    }
  }

  componentDidMount(){
    this.apiCall()
  }

  apiCall=()=>{
    const token = localStorage.getItem('token')
    axios.post(`${baseURL}yesnoquestion/list_questions/`, {
        token: token,
      })
    .then(res => {
      const data = res.data;
      console.log('data',data)
      let new_question = {}
      if (data.result) {
        if (data.data.yes_no_question) {
          new_question = data.data.yes_no_question[0]
        }
        this.setState({winner:data.winner, guess_word: data.data.guessed_word.word,all_question: data.data.responded_yes_no_question, new_question:new_question, token:token, errorState:false})  
      }else{
        this.setState({error:data.errors[0], errorState:true})
      }
      
    })
  }

  
  submitHandler = (question_id, given_response) => {
    const { token} = this.state;
    axios.post(`${baseURL}yesnoquestion/respond_to_question/`, {
        "token": token,
        "question_id": question_id,
        "given_response": given_response,
      })
    .then(res => {
      const data = res.data;
      console.log(data);
      if (data.result) {
        this.apiCall()
        this.setState({errorState:false})
      }else{
        this.setState({error:data.errors[0], errorState:true})
      }
    }).catch(err => {
      console.log(err);          
    });
    
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

  changeHandler = (event, pk) => {
    this.setState({...this.state, guessword: {[pk]:event.target.value}});
  }
  
  render() {
    const {all_question, new_question, guess_word, errorState, error, winner} = this.state
    console.log()
    return (
      <div className={'col-lg-6 offset-lg-3 question-page'}>
        { winner ? <div> <p>winner of last game is {winner}</p> <button className={'btn btn-primary'} onClick={()=>this.endGame()} > Okay </button></div>:
        <div>
          <h1>List of available questions asked</h1>
          <h4>Given word was "{guess_word}"</h4>
          <h5>New question available ( {all_question.length}/ 20)</h5>
          {all_question.map((question, index)=>{
            return(
              <div className={'card col-12'}>
                <div className={'card-body'}>
                  <h4 className={'card-text'}>{index+1}. {question.question}</h4>
                  <p>Response {question.response}</p>
                </div>
              </div>
          )})}
          { Object.getOwnPropertyNames(new_question).length > 0 ? 
          <div className={'card col-12'}>
            <div className={'card-body'}>
              <p className={'card-text'}>{new_question.question}</p>
              <div>
                <button onClick={()=>this.submitHandler(new_question.pk, 'yes')} className={'btn btn-primary'}>Yes</button>
                <button onClick={()=>this.submitHandler(new_question.pk, 'no')} className={'btn btn-primary'}>No</button>
              </div>
            </div>
          </div>:null}
        </div>}
        {errorState? <p className={'error-value'}>{error}</p>:null}
      </div>
    );
  }
}

export default YesNoQuestion;
