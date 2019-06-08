import React from 'react';
import {NavLink} from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

import { FaTimes, FaSearch, FaGripVertical, FaCode, FaInfo, FaRegImage, FaAngleDoubleDown, FaAngleDoubleLeft, FaComments, FaRegWindowRestore, FaRegWindowMaximize, FaRegWindowMinimize, FaRegWindowClose} from 'react-icons/fa';


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
    <Nav.Link onClick={() => {props.handleTabChange("comments", props.windowId)}}><FaComments/></Nav.Link>
  </Nav.Item>
  {props.openWidthHeight != "minimum" &&
  <Nav.Item>
    <Nav.Link onClick={() => {props.handleMinimize(props.windowId)}}><FaRegWindowMinimize/></Nav.Link>
  </Nav.Item>}
  {props.openWidthHeight != "middle" &&
  <Nav.Item>
    <Nav.Link onClick={() => {props.handleMiddlize(props.windowId)}}><FaRegWindowRestore/></Nav.Link>
  </Nav.Item>
  }
  {props.openWidthHeight != "maximum" &&
  <Nav.Item>
    <Nav.Link onClick={() => {props.handleMaximize(props.windowId)}}><FaRegWindowMaximize/></Nav.Link>
  </Nav.Item>
  }
  <Nav.Item>
    <Nav.Link onClick={() => {props.handleClose(props.windowId)}}><FaRegWindowClose/></Nav.Link>
  </Nav.Item>
  <Nav.Item>
    <Nav.Link onClick={() => {props.handleSwitchWindow(props.windowId, props.windowType)}}>{props.windowType === "sideWindow" ? <FaAngleDoubleDown/> : <FaAngleDoubleLeft/>}</Nav.Link>
  </Nav.Item>


</Nav>

  );
}

export default WindowNavBar;
