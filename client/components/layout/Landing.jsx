import React from "react";
import Login from './../auth/Login.jsx';
import Register from './../auth/Register.jsx'

class Landing extends React.Component {
  componentDidMount() {
    // if (this.props.auth.isAuthenticated) {
    //   console.log(this.props.history);
    //   this.props.history.push("/dashboard");
    // }
  }
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