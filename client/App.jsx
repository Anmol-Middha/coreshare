import React from 'react';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";
import { Provider } from "react-redux";

import PrivateRoute from "./privateroutes";
import Landing from "./components/layout/Landing.jsx";
import Dashboard from "./components/dashboard/Dashboard.jsx"
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

export default class App extends React.Component {
  render(){
      return(
        <Provider store = {store}>
        <div>
            <Switch>
              <Route exact path="/" component={Landing}/>
            </Switch>
            <Switch>
            <PrivateRoute exact path="/dashboard" component={Dashboard}/> 
            </Switch>
        </div>
        </Provider>
      )
  }
}

