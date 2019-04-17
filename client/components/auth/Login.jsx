import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "./../../actions/authActions";
import { Link, withRouter} from "react-router-dom";
import { Modal, Button, Form} from 'react-bootstrap';

class Login extends React.Component {
constructor() {
  super();
  this.state = {
    username: "",
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
      <Button onClick={this.openModal} variant="outline-info">Login</Button>
      <Modal show={this.state.modalIsOpen} onHide={this.closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate onSubmit = {this.onSubmit}>
            <Form.Group>
              <Form.Label>Email:</Form.Label>
              <Form.Control type="text" id="email" name="email" value={this.state.email} onChange={this.handleChangeEvent}></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Password:</Form.Label>
              <Form.Control type="password" id="password" name="password" value={this.state.password} onChange={this.handleChangeEvent}></Form.Control>
            </Form.Group>
            <Button variant="info" type="submit">Submit</Button>
          </Form>
        </Modal.Body> 
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