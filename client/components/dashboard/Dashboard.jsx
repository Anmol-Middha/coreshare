import React, { Component } from "react";
import PropTypes from "prop-types";
import {Button, Form, Row, Col} from 'react-bootstrap';
import {connect} from "react-redux";
import {syncCloud} from "./../../actions/cloudActions.js";
import Navigation from "../layout/Navigation.jsx";

class Dashboard extends Component {
  constructor(){
    super();
    this.state = {
      cloudType: "gdrive",
    };
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
  render() {
  const { user } = this.props.auth;
  return (
    <div style={{height: "75vh", paddingTop: "80px"}} className="container valign-wrapper">
      <Navigation/>
        <div className = "row">
              <Form noValidate onSubmit = {this.onSubmit}>
              <Form.Label>Select Cloud</Form.Label>
              <Row>
              <Col xs={12}>
              <Form.Control as="select" size="sm" onChange={this.onOptionSelect} value={this.state.cloudType}>
                <option value="gdrive">Googel Drive</option>
                <option value="mbox">Dropbox</option>
              </Form.Control>
              </Col>
              </Row>
              <br/>
              <Button type="submit" variant="info">Synchronize</Button>
              </Form>
        </div>
    </div>
  );
  }
}

Dashboard.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  cloud: state.cloud,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { syncCloud }
)(Dashboard);