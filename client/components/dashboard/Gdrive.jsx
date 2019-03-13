import React, { Component } from 'react';
import { Link, withRouter} from "react-router-dom";
import PropTypes from "prop-types";
import Modal from 'react-modal';
import {connect} from "react-redux";
import {logoutUser} from "./../../actions/authActions.js";
import {syncCloud} from "./../../actions/cloudActions.js";
import {uploadFile} from "./../../actions/cloudActions.js";

class Gdrive extends Component {
    constructor(){
        super();
        this.state={
            file: null,
            modalIsOpen: false,
            toemail:""
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
        const data = new FormData();
        data.append('filename', this.state.file);
        this.props.uploadFile(data);
    }
    handleCancelEvent(){
        this.setState({
            file: null
        })
    }
    emailChangeEvent(e){
        this.setState({
            toemail: e.target.value
        })
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
    onShare(e){
        e.preventDefault();
        socket.emit('send_file', this.state.toemail);
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
            <button onClick={this.openModal}>Share</button>
            <Modal isOpen = {this.state.modalIsOpen} onRequestClose = {this.closeModal} contentLabel = "Register" className="Modal">
                <Link to= '/dashboard/gdrive'>
                    <button onClick={this.closeModal}><span className="closebtn glyphicon glyphicon-remove"></span></button>
                </Link>
                <fieldset>
                    <form noValidate onSubmit = {this.onShare}>
                        <label htmlFor="email">Email:</label>
                        <input type="text" id="toemail" name="toemail" value={this.state.toemail} onChange={this.emailChangeEvent}></input>
                        <div>
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
Gdrive.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
  };
const mapStateToProps = state => ({
    auth: state.auth,
    cloud: state.cloud
});
export default connect(
    mapStateToProps,
    { logoutUser, syncCloud, uploadFile }
  )(Gdrive);