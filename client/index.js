import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";
import { Provider } from "react-redux";
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShareSquare } from '@fortawesome/free-solid-svg-icons'

library.add(faShareSquare)

import PrivateRoute from "./privateroutes";
import Landing from "./components/layout/Landing.jsx";
import Dashboard from "./components/dashboard/Dashboard.jsx"
import Gdrive from "./components/dashboard/Gdrive.jsx";
import store from "./store";

// Check for token to keep user logged in
if (localStorage.jwtToken) {
  // Set auth token header auth
  const token = localStorage.jwtToken;
  setAuthToken(token);
  // Decode token and get user info and exp
  const decoded = jwt_decode(token);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
// Check for expired token
  const currentTime = Date.now() / 1000; // to get in milliseconds
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // Redirect to login
    window.location.href = "/";
  }
}

ReactDOM.render(
  <Provider store = {store}>
    <Router>
      <div>
        <Switch>
          <Route exact path="/" component={Landing}/>
        </Switch>
        <Switch>
        <PrivateRoute exact path="/dashboard" component={Dashboard}/> 
        <PrivateRoute exact path="/dashboard/gdrive" component={Gdrive}/>
        </Switch>
      </div>
    </Router>            
  </Provider>
  , document.getElementById('root')
);
