import React from 'react';
import {NavLink, Link} from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';

import {resourceEndpoint} from './config';

import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';


function NavBar() {
  return (
    <Navbar bg="dark" variant="light" expand="lg" fixed="top">
      <Nav>
        <NavLink className="nav-link" to="/">SCTA Reading Room</NavLink> 
      </Nav>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
      <Nav>



        <NavLink className="nav-link" to={"/text?resourceid=" + resourceEndpoint}>Text</NavLink>
        {// example drop down
          // <NavDropdown title="Dropdown" id="basic-nav-dropdown">
        //   <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
        //   <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
        //   <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
        //   <NavDropdown.Divider />
        //   <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
        // </NavDropdown>
      }
      <NavLink className="nav-link" to="/search">Search</NavLink>
      </Nav>

      <Nav>
        <NavLink className="nav-link" to="/about">About</NavLink>
        <NavLink className="nav-link" to="/donate">Donate</NavLink>
      </Nav>
      </Navbar.Collapse>
    </Navbar>

  );
}

export default NavBar;
