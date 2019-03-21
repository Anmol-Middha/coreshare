import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';
import {Dropdown} from 'react-bootstrap';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {logoutUser} from "../../actions/authActions";
import {getCount, listNotifications} from '../../actions/navActions';


class Navbar extends Component {
    constructor(){
        super();
        this.state = {
            
        }
    }
    componentDidMount(){

            this.props.getCount();
            this.props.listNotifications();    
    }
    render() {
    return (
        <div>
            <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                    Notifications
                </Dropdown.Toggle>
                <Dropdown.Menu>
                <p>hello</p>
                    {this.props.nav.notifications.map(curr_notif =>( 
                        <Dropdown.Item>{curr_notif}</Dropdown.Item>)
                    )}
                </Dropdown.Menu>
            </Dropdown>;
            
        </div>
    )
  }
}

Navbar.propTypes = {
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
    {logoutUser, getCount, listNotifications}
)(withRouter(Navbar))