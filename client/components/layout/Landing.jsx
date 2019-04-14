import React from "react";
import Login from './../auth/Login.jsx';
import Register from './../auth/Register.jsx';
import { Button, Navbar, Nav, NavDropdown} from 'react-bootstrap';


class Landing extends React.Component {
  render() {
    return (
      <Navbar bg="dark" expand="lg" variant="dark">
        <Navbar.Brand href="/dashboard">Coreshare</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
            <Register />
            <Login />
        </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}
export default Landing;