import React from 'react';
import {NavLink} from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';


import {resourceEndpoint} from './config';

import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';


function WindowNavBar(props) {
  console.log("windownavbarprops", props)
  return (
  <Nav variant="tabs" defaultActiveKey="/active">
  <Navbar.Brand href="/">Focus: {props.focus}</Navbar.Brand>
  <Nav.Item>
    <Nav.Link onClick={() => {props.handleTabChange("info", props.windowType)}}>Info</Nav.Link>
  </Nav.Item>
  <Nav.Item>
    <Nav.Link onClick={() => {props.handleTabChange("surface2", props.windowType)}}>Surface2</Nav.Link>
  </Nav.Item>
  <Nav.Item>
    <Nav.Link onClick={() => {props.handleTabChange("xml", props.windowType)}}>Xml</Nav.Link>
  </Nav.Item>
  <Nav.Item>
    <Nav.Link onClick={() => {props.handleClose(props.windowType)}}>Close</Nav.Link>
  </Nav.Item>
  <Nav.Item>
    <Nav.Link onClick={() => {props.handleSwitchWindow(props.windowType)}}>{props.windowType === "sideWindow" ? "Bottom Window" : "Side Window"}</Nav.Link>
  </Nav.Item>


</Nav>

  );
}

export default WindowNavBar;
