import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';
import {Dropdown, Button} from 'react-bootstrap';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {logoutUser} from "../../actions/authActions";
import {getCount, listNotifications, ignoreNotification} from '../../actions/navActions';


class Navbar extends Component {
    constructor(){
        super();
        this.state = {
            
        }
        this.ignore = this.ignore.bind(this);
        // this.accept = this.accept.bind(this);
    }
    componentDidMount(){
        this.props.getCount();
        this.props.listNotifications();    
    }
    ignore(e){
        this.props.ignoreNotification(e.target.value);
    }   
    render() {
    return (
        <div>
            <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                    Notifications
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    {this.props.nav.notifications.map(curr_notif =>( 
                        <Dropdown.Item>{curr_notif.message.toString()}
                        <Button value={curr_notif.sharedFileId} onClick={this.accept}>Accept</Button>
                        <Button value={curr_notif.sharedFileId} onClick={this.ignore}>Ignore</Button>
                        </Dropdown.Item>
                        )
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
    {logoutUser, getCount, listNotifications, ignoreNotification}
)(withRouter(Navbar))