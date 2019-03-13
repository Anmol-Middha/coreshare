import React from "react";
import Login from './../auth/Login.jsx';
import Register from './../auth/Register.jsx'


class Landing extends React.Component {
  render() {
    return (
      <div>
        <Register/>
        <Login/>
      </div>
    );
  }
}
export default Landing;