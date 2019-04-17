import React, { Component } from 'react';
import PropTypes from "prop-types";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {Modal, Form, Button, Row, Col, Card, Nav, Navbar, Container, Jumbotron} from 'react-bootstrap';
import {connect} from "react-redux";
import Navigation from "./../layout/Navigation.jsx";
import {syncCloud, uploadFile, shareFile} from "./../../actions/cloudActions.js";
import store from '../../store';
import gdriveimage from '../../images/gdrive.png';
import mboximage from '../../images/dropbox.png';

class Gdrive extends Component {
    constructor(){
        super();
        this.state={
            file: null,
            cloudLogo: "",
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
    componentDidMount(){
        const cloudtype = this.props.cloud.type;
        if(cloudtype == "Google Drive"){
            this.setState({
                cloudLogo: gdriveimage
            })
            console.log(this.state.cloudLogo);
        }
        else if(cloudtype == "Dropbox"){
            this.setState({
                cloudLogo: mboximage
            })
            console.log(this.state.cloudLogo);
        }
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
        <div style={{ height: "75vh", paddingTop: "80px"}} className="container valign-wrapper">
            <Navigation/>
            <Row>
                <Col md={4}>
                    <h3>Upload file on cloud:</h3><br/>
                    <Form noValidate onSubmit={this.onUpload}>
                        <Form.Group>
                            <Form.Label>Filename</Form.Label>
                            <Form.Control type="file" onChange={this.onFileChange} name= "filename"></Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Row>
                                <Col xs={2}><Button type="submit" size="md" variant="info">Upload</Button></Col>
                                <Col xs={{span: '2', offset: '1'}}><Button size="md" variant="secondary" onClick={this.handleCancelEvent}>Cancel</Button></Col>
                            </Row>
                        </Form.Group>
                    </Form>
                </Col>
                <Col md={8}>
                <Card style={{height: '540px'}}>
                    <Card.Header style={{textAlign: "center"}}>  
                        {console.log(this.state.cloudLogo)}
                        {console.log(mboximage)}                          
                        {console.log(typeof(this.state.cloudLogo))}
                        <h3><img src={this.state.cloudLogo}></img>&nbsp;{this.props.cloud.type}</h3>
                    </Card.Header>
                    <Card.Body style={{overflowY: 'scroll', backgroundColor: '#eee'}}>
                    <Row>
                    {this.props.cloud.files.map(file => (
                        <Col sm={4} style={{padding: '10px'}}>
                        <Card>
                        <Card.Header style={{textAlign: 'center'}}><FontAwesomeIcon style={{fontSize: '80px', color: '#428bca'}} icon="file"></FontAwesomeIcon></Card.Header>  
                        <Card.Body>
                            <Row>
                            <Col xs={12}><Card.Subtitle className="mb-2">{file.name}</Card.Subtitle></Col>
                            </Row>
                            <Row>
                                <Col xs={4}><Button size="sm" variant="secondary" onClick={this.openModal} value={[file.id, file.name]}>Share</Button></Col>
                                <Col xs={4}><Button size="sm" variant="secondary" >Delete</Button></Col>
                            </Row>
                        </Card.Body>                      
                        </Card>
                        </Col>
                    ))}
                    </Row>
                    </Card.Body>
                </Card>
                </Col>
            </Row>                        
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
                    <Button variant="info" type="submit">Submit</Button>
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