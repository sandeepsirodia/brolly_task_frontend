import React from 'react';
import { Switch, Route, Router } from 'react-router-dom';

import Auth from './components/Auth/Auth';
import Dashboard from './components/Dashboard/Dashboard';
import RespondAnswer from './components/RespondAnswer/RespondAnswer';
import YesNoQuestion from './components/YesNoQuestion/YesNoQuestion';
import history from './history';

const Routes = () => (
  <main>
    <Router history={history}>
      <Switch>
        <Route exact path='/' component={Auth}/>
        <Route path='/dashboard' component={Dashboard}/>
        <Route path='/yes-no-question' component={YesNoQuestion}/>
        <Route path='/submit-answer' component={RespondAnswer}/>
      </Switch>
    </Router>
  </main>
)

export default Routes;
