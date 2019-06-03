import React from 'react';
import {NavLink} from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

import { FaTimes, FaSearch, FaGripVertical, FaCode, FaInfo, FaRegImage, FaAngleDoubleDown, FaAngleDoubleLeft} from 'react-icons/fa';


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
    <Nav.Link onClick={() => {props.handleTabChange("info", props.windowId)}}><FaInfo/></Nav.Link>
  </Nav.Item>
  <Nav.Item>
    <Nav.Link onClick={() => {props.handleTabChange("surface2", props.windowId)}}><FaRegImage/></Nav.Link>
  </Nav.Item>
  <Nav.Item>
    <Nav.Link onClick={() => {props.handleTabChange("xml", props.windowId)}}><FaCode/></Nav.Link>
  </Nav.Item>
  <Nav.Item>
    <Nav.Link onClick={() => {props.handleTabChange("textCompare", props.windowId)}}><FaGripVertical/></Nav.Link>
  </Nav.Item>
  <Nav.Item>
    <Nav.Link onClick={() => {props.handleTabChange("search", props.windowId)}}><FaSearch/></Nav.Link>
  </Nav.Item>
  <Nav.Item>
    <Nav.Link onClick={() => {props.handleClose(props.windowId)}}><FaTimes/></Nav.Link>
  </Nav.Item>
  <Nav.Item>
    <Nav.Link onClick={() => {props.handleSwitchWindow(props.windowId, props.windowType)}}>{props.windowType === "sideWindow" ? <FaAngleDoubleDown/> : <FaAngleDoubleLeft/>}</Nav.Link>
  </Nav.Item>


</Nav>

  );
}

export default WindowNavBar;
