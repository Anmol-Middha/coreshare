import React from "react";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { registerUser } from './../../actions/authActions.js'; 
import { backToHome } from './../../actions/authActions.js';
import { Link, withRouter } from "react-router-dom";
import {Modal, Button, Form} from 'react-bootstrap';

class Register extends React.Component {
constructor() {
  super();
  this.state = {
    nemail: "",
    npassword: "",
    nuname: "",
    modalIsOpen: false,
    isRegistered: false,
    errors: {}
  };
  this.handleChangeEvent = this.handleChangeEvent.bind(this);
  this.openModal = this.openModal.bind(this);
  this.closeModal = this.closeModal.bind(this);
  this.onSubmit = this.onSubmit.bind(this);
  this.backToHome = this.backToHome.bind(this);
}
componentDidMount() {
  if (this.props.auth.isAuthenticated) {
    this.props.history.push("/dashboard");
  }
}
componentWillReceiveProps(nextProps) {
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
  const newUser = {
    username: this.state.nuname,
    email: this.state.nemail,
    password: this.state.npassword,
  };
  this.props.registerUser(newUser, this.props.history);
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

backToHome(){
  this.props.backToHome();
  this.setState({
    modalIsOpen: false,
    nemail: "",
    npassword: ""
  });
}



render(){

  if(this.props.auth.isRegistered){
    return(
      <div>
      <Button variant="outline-info" onClick={this.openModal}>Sign up</Button>
        <Modal show={this.state.modalIsOpen} onHide={this.closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>Welcome To Coreshare, Register</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h3>You have successfully registered<br/>Login to Continue</h3>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="info" onClick = {this.backToHome}>Back to Homepage</Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
  else{
    return(
      <div>
      <Button onClick={this.openModal} variant="outline-info">Register</Button>
        <Modal show={this.state.modalIsOpen} onHide={this.closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>Welcome To Coreshare, Register</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form noValidate onSubmit = {this.onSubmit}>
              <Form.Group>
                <Form.Label>Username</Form.Label>
                <Form.Control type="text" id="nuname" name="nuname" value={this.state.nuname} onChange={this.handleChangeEvent}></Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control type="text" id="nemail" name="nemail" value={this.state.nemail} onChange={this.handleChangeEvent}></Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" id="npassword" name="npassword" value={this.state.npassword} onChange={this.handleChangeEvent}></Form.Control>
              </Form.Group>
              <Button variant="info" type="submit">Submit</Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
      
    )
  }
  
}
}

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { registerUser, backToHome }
)(withRouter(Register));