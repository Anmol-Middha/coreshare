import React, { Component } from 'react';
import { Link, withRouter} from "react-router-dom";
import PropTypes from "prop-types";
import {Modal, Form, Button} from 'react-bootstrap';
import {connect} from "react-redux";
import {logoutUser} from "./../../actions/authActions.js";
import {syncCloud, uploadFile, shareFile} from "./../../actions/cloudActions.js";
import store from '../../store';

class Gdrive extends Component {
    constructor(){
        super();
        this.state={
            file: null,
            modalIsOpen: false,
            receiverEmail:"",
            sharingFile: [],
        }
        this.onFileChange = this.onFileChange.bind(this);
        this.onUpload = this.onUpload.bind(this);
        this.handleCancelEvent = this.handleCancelEvent.bind(this);
        this.emailChangeEvent = this.emailChangeEvent.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.onShare = this.onShare.bind(this);
    }
    onFileChange(e){
        this.setState({
            file: e.target.files[0]
        });
    }
    onUpload(e){
        e.preventDefault();
        const uid = store.getState().auth.user._id;
        const data = new FormData();
        data.append('filename', this.state.file);
        data.append('uid', uid);
        this.props.uploadFile(data);
    }
    handleCancelEvent(){
        this.setState({
            file: null
        })
    }
    emailChangeEvent(e){
        this.setState({
            receiverEmail: e.target.value
        })
    }
    openModal(e){
        this.setState({
            modalIsOpen: true,
            sharingFile: e.target.value
        })
    }
    closeModal(){
        this.setState({
            modalIsOpen: false
        })
    }
    onShare(e){
        e.preventDefault();
        this.props.shareFile(this.state.sharingFile, this.state.receiverEmail);
    }
    render() {    
    return (
        <div>
            <table>
                <thead>
                    <tr><th>fileid</th><th>filename</th></tr>
                </thead>
                <tbody>
                    {this.props.cloud.files.map(file =>(
                        <tr>
                            <td>{file.id}</td>
                            <td>{file.name}</td>
                            <td><button onClick={this.openModal} value={[file.id, file.name]}>Share</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <fieldset>
                <form noValidate onSubmit={this.onUpload}>
                <div>
                    <label>filename</label>
                    <input type="file" onChange={this.onFileChange} name= "filename"></input>
                </div>
                <div>
                    <button type="submit">Upload</button> 
                    <button onClick={this.handleCancelEvent}>Cancel</button>
                </div>
                </form>
            </fieldset>
            
            <Modal show={this.state.modalIsOpen} onHide={this.closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Share File</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form noValidate onSubmit = {this.onShare}>
                    <Form.Group>
                    <Form.Label>Email:</Form.Label>
                    <Form.Control type="text" id="receiverEmail" name="receiverEmail" value={this.state.receiverEmail} onChange={this.emailChangeEvent}></Form.Control>
                    </Form.Group>
                    <Button type="submit">Submit</Button>
                </Form>
                </Modal.Body> 
            </Modal>
        </div>
    )
  }
}
Gdrive.propTypes = {
    cloud: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
  };
const mapStateToProps = state => ({
    cloud: state.cloud,
    errors: state.errors
});
export default connect(
    mapStateToProps,
    {syncCloud, uploadFile, shareFile}
  )(Gdrive);