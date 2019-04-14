import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';
import { Button, Navbar, Nav, NavDropdown, Row, Col} from 'react-bootstrap';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {logoutUser} from "../../actions/authActions";
import {getCount, listNotifications, ignoreNotification, acceptNotification} from '../../actions/navActions';

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
        <Navbar bg="dark" expand="lg" variant="dark" fixed="top">
        <Navbar.Brand href="/dashboard">Coreshare</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="nav-right">
            <Nav.Link href="/dashboard">Home</Nav.Link>
            <NavDropdown title="Notifications" id="basic-nav-dropdown">
                {this.props.nav.notifications.map(curr_notif =>
                (
                    <div>
                    <NavDropdown.Divider />
                    <NavDropdown.Item>{curr_notif.message.toString()}
                    <div>
                    <Row>
                        <Col xs={10}><Button value={curr_notif.notificationId} variant="info" size="sm" onClick={this.accept}>Accept</Button></Col>
                        <Col xs={2}><Button value={curr_notif.notificationId} variant="secondary" size="sm" onClick={this.ignore}>Ignore</Button></Col>
                    </Row>
                    </div>    
                    </NavDropdown.Item>
                    </div>
                )
                )}
            </NavDropdown>
            <Button onClick={this.onLogoutClick} variant="outline-info">
                Logout
            </Button>
        </Nav>
        </Navbar.Collapse>
        </Navbar>
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