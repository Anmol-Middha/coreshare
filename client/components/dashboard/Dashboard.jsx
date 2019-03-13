import React, { Component } from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {logoutUser} from "./../../actions/authActions.js";
import {syncCloud} from "./../../actions/cloudActions.js";
class Dashboard extends Component {
  constructor(){
    super();
    this.state = {
      cloudType: "gdrive",
    };
    this.onLogoutClick = this.onLogoutClick.bind(this);
    this.onOptionSelect = this.onOptionSelect.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  onOptionSelect(e){
    this.setState({
      cloudType: e.target.value
    })
  }
  onSubmit(e){
    e.preventDefault();
    let cloud = {
      cloudType: this.state.cloudType
    };
    this.props.syncCloud(cloud, this.props.history);
  }
  onLogoutClick(e){
    e.preventDefault();
    this.props.logoutUser(this.props.history);
  };
render() {
    const { user } = this.props.auth;
return (
      <div style={{ height: "75vh" }} className="container valign-wrapper">
        <div className="row">
          <div className="col s12 center-align">
            <button
              onClick={this.onLogoutClick}
              className="btn btn-large waves-effect waves-light hoverable blue accent-3"
            >
              Logout
            </button>
            <fieldset>
              <form noValidate onSubmit = {this.onSubmit}>
              <div>
                <label>Select Cloud</label>
                <select onChange={this.onOptionSelect} value={this.state.cloudType}>
                  <option value="gdrive">Googel Drive</option>
                  <option value="mbox">Dropbox</option>
                </select>
              </div>
              <button type="submit">Synchronize</button>
              </form>
            </fieldset>
          </div>
        </div>
      </div>
    );
  }
}
Dashboard.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth,
  cloud: state.cloud
});
export default connect(
  mapStateToProps,
  { logoutUser, syncCloud }
)(Dashboard);