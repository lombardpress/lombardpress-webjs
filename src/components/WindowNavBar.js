import React from 'react';
import {NavLink} from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';


import {resourceEndpoint} from './config';

import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';


function WindowNavBar(props) {
  
  return (
  <Nav variant="tabs">
  {
    //<Navbar.Brand href="/">Focus: {props.focus}</Navbar.Brand>
  }
  <Nav.Item>
    <Nav.Link onClick={() => {props.handleTabChange("info", props.windowId)}}>Info</Nav.Link>
  </Nav.Item>
  <Nav.Item>
    <Nav.Link onClick={() => {props.handleTabChange("surface2", props.windowId)}}>Surface2</Nav.Link>
  </Nav.Item>
  <Nav.Item>
    <Nav.Link onClick={() => {props.handleTabChange("xml", props.windowId)}}>Xml</Nav.Link>
  </Nav.Item>
  <Nav.Item>
    <Nav.Link onClick={() => {props.handleTabChange("textCompare", props.windowId)}}>Compare</Nav.Link>
  </Nav.Item>
  <Nav.Item>
    <Nav.Link onClick={() => {props.handleTabChange("search", props.windowId)}}>Search</Nav.Link>
  </Nav.Item>
  <Nav.Item>
    <Nav.Link onClick={() => {props.handleClose(props.windowId)}}>Close</Nav.Link>
  </Nav.Item>
  <Nav.Item>
    <Nav.Link onClick={() => {props.handleSwitchWindow(props.windowId, props.windowType)}}>{props.windowType === "sideWindow" ? "Bottom Window" : "Side Window"}</Nav.Link>
  </Nav.Item>


</Nav>

  );
}

export default WindowNavBar;
