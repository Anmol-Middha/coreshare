import React from "react";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { registerUser } from './../../actions/authActions.js'; 
import { backToHome } from './../../actions/authActions.js';
import { Link, withRouter } from "react-router-dom";
import Modal from 'react-modal';

class Register extends React.Component {
constructor() {
  super();
  this.state = {
    nemail: "",
    npassword: "",
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
        <button onClick={this.openModal}>Register</button>
        <Modal isOpen = {this.state.modalIsOpen} onRequestClose = {this.closeModal} contentLabel = "Successfully Regitstered" className ="Modal">
          <div>
            <h3>You have successfully registered<br/>Login to Continue</h3>
            <Link to="/">
              <button onClick = {this.backToHome}>Back to Homepage</button>
            </Link>
          </div>
        </Modal>
      </div>
    )
  }
  else{
    return(
      <div>
        <button onClick={this.openModal}>Register</button>
        <Modal isOpen = {this.state.modalIsOpen} onRequestClose = {this.closeModal} contentLabel = "Register" className="Modal">
        <Link to= '/'>
          <button onClick={this.closeModal}><span className="closebtn glyphicon glyphicon-remove"></span></button>
        </Link>
        <fieldset>
          <form noValidate onSubmit = {this.onSubmit}>
          <label htmlFor="email">Email:</label>
          <input type="text" id="nemail" name="nemail" value={this.state.nemail} onChange={this.handleChangeEvent}></input>
          <label htmlFor="amount">Password:</label>
          <input type="password" id="npassword" name="npassword" value={this.state.npassword} onChange={this.handleChangeEvent}></input>
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