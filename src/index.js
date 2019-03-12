import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import history from './history';


ReactDOM.render(
  <BrowserRouter>
    <App history={history}/>
  </BrowserRouter>,
  document.getElementById('root'));

