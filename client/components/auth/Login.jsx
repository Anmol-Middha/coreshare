import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "./../../actions/authActions";
import { Link, withRouter} from "react-router-dom";
import Modal from 'react-modal';

class Login extends React.Component {
constructor() {
  super();
  this.state = {
    email: "",
    password: "",
    modalIsOpen: false,
    errors: {}
  };
  this.handleChangeEvent = this.handleChangeEvent.bind(this);
  this.openModal = this.openModal.bind(this);
  this.closeModal = this.closeModal.bind(this);
  this.onSubmit = this.onSubmit.bind(this);
}
componentDidMount() {
  if (this.props.auth.isAuthenticated) {
    this.props.history.push("/dashboard");
  }
}
componentWillReceiveProps(nextProps) {
  if (nextProps.auth.isAuthenticated) {
    this.props.history.push("/dashboard");
  }
if (nextProps.errors) {
    this.setState({
      errors: nextProps.errors
    });
  }
}

handleChangeEvent(e){
  this.setState({
    [e.target.id]: e.target.value,
  });
  
}
onSubmit(e){
  e.preventDefault();
  const userData = {
    email: this.state.email,
    password: this.state.password
  };
  this.props.loginUser(userData, this.props.history);
 
}

openModal(){
  this.setState({
    modalIsOpen: true
  })
}

closeModal(){
  this.setState({
    modalIsOpen: false
  })
}

render(){
  return(
    <div>
      <button onClick={this.openModal}>Login</button>
      <Modal isOpen = {this.state.modalIsOpen} onRequestClose = {this.closeModal} contentLabel = "Register" className="Modal">
      <Link to= '/'>
        <button onClick={this.closeModal}><span className="closebtn glyphicon glyphicon-remove"></span></button>
      </Link>
      <fieldset>
        <form noValidate onSubmit = {this.onSubmit}>
        <label htmlFor="email">Email:</label>
        <input type="text" id="email" name="email" value={this.state.email} onChange={this.handleChangeEvent}></input>
        <label htmlFor="amount">Password:</label>
        <input type="password" id="password" name="password" value={this.state.password} onChange={this.handleChangeEvent}></input>
        <div className = "button-center">
        <br/>
        <button type="submit">Submit</button>
        </div>
        </form>
      </fieldset>
      </Modal>
    </div>
  )
}
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});
export default connect(
  mapStateToProps,
  { loginUser }
)(withRouter(Login));