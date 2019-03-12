import '../main.scss';
import React, { Component } from 'react';
import axios from 'axios';
import baseURL from '../../request';

class Auth extends Component {
  constructor(props) {
    super(props);
    this.state={
      name: '',
      password: '',
      repassword: '',
      user_details:{},
      register:true,
      loggedIn:false,
      errorState:false,
      error:false,
    }
  }

  

  handleResponse=(data)=>{
    if (data.result) {
      localStorage.setItem('token', data.token);
      this.setState({user_details: data.data, errorState:false})
      window.location.reload()
    }else{
      this.setState({error:data.errors[0], errorState:true})
    }
  }



  submitHandler = (event) => {
    event.preventDefault();
    const {register} = this.state;
    event.target.className += ' was-validated';
    if(event.target.checkValidity()){
      if (register){
        axios.post(`${baseURL}user/register/`, {
            "name": this.state.name,
            "password": this.state.password,
            "repassword":this.state.repassword,
          })
        .then(res => {
          const data = res.data;
          this.handleResponse(data)
          
        }).catch(err => {
          console.log(err);          
        });
      }else{
        axios.post(`${baseURL}user/login/`, {
            "name": this.state.name,
            "password": this.state.password,
            "repassword":this.state.repassword,
          })
        .then(res => {
          const data = res.data;
          this.handleResponse(data)
        }).catch(err => {
          console.log(err);
        });
      }
    }
  }



  changeHandler = (event) => {
    this.setState({...this.state, [event.target.name]: event.target.value});
  }


  
  render() {
    const {register, errorState, error} = this.state
    return (
      <div className={'col-lg-4 offset-lg-4 main-page'}>
        <div className={'register-div'}>
          <h1> {register ? 'Register' : 'Login'} </h1>
          <form onSubmit={this.submitHandler} className={''} noValidate>
            <div className="col-12 input-div">
              <input value={this.state.name} name='name' onChange={this.changeHandler} type="text" id="defaultFormRegisterNameEx"
              className="form-control" placeholder="Name" required/>
              <div className="invalid-feedback ">This field cannot be empty.</div>
            </div>
            <div className="col-12 input-div">
              <input value={this.state.password} name='password' onChange={this.changeHandler} type="password" id="defaultFormRegisterPassEx"
              className="form-control" placeholder="Password" required/>
              <div className="invalid-feedback ">This field cannot be empty.</div>
            </div> 
            {register ?
            <div className="col-12 input-div">
              <input value={this.state.repassword} name='repassword' onChange={this.changeHandler} type="password" id="defaultFormRegisterRepassEx"
              className="form-control" placeholder="Re Password" required/>
              <div className="invalid-feedback ">This field cannot be empty.</div>
            </div>: null }
            <button className="btn btn-unique button-class" type="submit">Submit</button>
            <span className={'login-register'} onClick={() => this.setState({register:!register})}> {register ? 'Already registered login?': 'Register?'} </span>
          </form>
        </div>
        {errorState? <span className={'error-value'}>{error}</span>:null}
      </div>
    );
  }
}

export default Auth;
