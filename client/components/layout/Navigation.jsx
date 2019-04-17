import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';
import { Button, Navbar, Nav, NavDropdown, Row, Col, Transition, Container} from 'react-bootstrap';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {logoutUser} from "../../actions/authActions";
import {getCount, listNotifications, ignoreNotification, acceptNotification} from '../../actions/navActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Navigation extends Component {
    constructor(){
        super();
        this.state = {}
        this.onLogoutClick = this.onLogoutClick.bind(this);
        this.ignore = this.ignore.bind(this);
        this.accept = this.accept.bind(this);
    }
    componentDidMount(){
        this.props.getCount();
        this.props.listNotifications();    
    }
    ignore(e){
        this.props.ignoreNotification(e.target.value);
    }   
    accept(e){
        this.props.acceptNotification(e.target.value);
    }
    onLogoutClick(e){
        e.preventDefault();
        this.props.logoutUser(this.props.history);
    };

    render() {
    return (
        <Container>
        <Navbar bg="dark" expand="lg" variant="dark" fixed="top">
        <Navbar.Brand href="/dashboard">Coreshare</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
        <Nav>
            <Nav.Link href="/dashboard">Home</Nav.Link>
            <Nav.Link href="#">About Us</Nav.Link>
            <Nav.Link href="#">Career</Nav.Link>
        </Nav>
        <Nav>
            <NavDropdown title={<span className="fa-layers fa-fw"><FontAwesomeIcon icon="bell" style={{fontSize: '25px'}}></FontAwesomeIcon><span className="fa-layers-counter" style={{fontSize: '40px'}}>{this.props.nav.count}</span></span>} id="notifications">
                <div style={{maxHeight: '400px', overflowY: 'scroll'}}>
                {this.props.nav.notifications.map(curr_notif =>
                (
                    <div>
                    <NavDropdown.Divider />
                    <NavDropdown.Item>{curr_notif.message.toString()}
                    <div>
                    <Row>
                        <Col xs={{span: 2, offset: 8}}><Button value={curr_notif.notificationId} variant="info" size="sm" onClick={this.accept}>Accept</Button></Col>
                        <Col xs={{span:2}}><Button value={curr_notif.notificationId} variant="secondary" size="sm" onClick={this.ignore}>Ignore</Button></Col>
                    </Row>
                    </div>    
                    </NavDropdown.Item>
                    </div>
                )
                )}
                </div>
            </NavDropdown>
            <NavDropdown title={<span className="fa-layers fa-fw"><FontAwesomeIcon icon="user-circle" style={{fontSize: '25px'}}></FontAwesomeIcon></span>} id="Accounts">
                <div style={{maxWidth:'200px'}}>
                    <NavDropdown.Item><h5>Welcome</h5>{this.props.auth.user.username}</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item>My Account</NavDropdown.Item>
                    <NavDropdown.Item>Settings</NavDropdown.Item>
                    <NavDropdown.Item onClick={this.onLogoutClick}>Sign Out</NavDropdown.Item>
                </div>
            </NavDropdown>
        </Nav>
        </Navbar.Collapse>
        </Navbar>
        </Container>
    )}
}

Navigation.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    nav: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state =>({
    auth: state.auth,
    nav: state.nav,
    errors: state.errors
})

export default connect(
    mapStateToProps,
    {logoutUser, getCount, listNotifications, ignoreNotification, acceptNotification}
)(withRouter(Navigation))