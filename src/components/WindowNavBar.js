import React from 'react';
import {NavLink} from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

import { FaTimes, FaSearch, FaGripVertical, FaCode, FaInfo, FaRegImage, FaAngleDoubleDown, FaAngleDoubleLeft, FaComments, FaRegWindowRestore, FaRegWindowMaximize, FaRegWindowMinimize, FaRegWindowClose, FaPencilAlt} from 'react-icons/fa';


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
    <Nav.Link title="Basic Resource Information" onClick={() => {props.handleTabChange("info", props.windowId)}}><FaInfo/></Nav.Link>
  </Nav.Item>
  <Nav.Item>
    <Nav.Link title="Images" onClick={() => {props.handleTabChange("surface3", props.windowId)}}><FaRegImage/></Nav.Link>
  </Nav.Item>
  <Nav.Item>
    <Nav.Link title="Text XML Source" onClick={() => {props.handleTabChange("xml", props.windowId)}}><FaCode/></Nav.Link>
  </Nav.Item>
  <Nav.Item>
    <Nav.Link title="Text Comparisons" onClick={() => {props.handleTabChange("textCompare", props.windowId)}}><FaGripVertical/></Nav.Link>
  </Nav.Item>
  <Nav.Item>
    <Nav.Link title="Text Search" onClick={() => {props.handleTabChange("search", props.windowId)}}><FaSearch/></Nav.Link>
  </Nav.Item>
  <Nav.Item>
    <Nav.Link title="Comments" onClick={() => {props.handleTabChange("comments", props.windowId)}}><FaComments/></Nav.Link>
  </Nav.Item>
  <Nav.Item>
    <Nav.Link title="Text Citation" onClick={() => {props.handleTabChange("citation", props.windowId)}}><FaPencilAlt/></Nav.Link>
  </Nav.Item>
  {props.openWidthHeight != "minimum" &&
  <Nav.Item>
    <Nav.Link title="Minimize Window" onClick={() => {props.handleMinimize(props.windowId)}}><FaRegWindowMinimize/></Nav.Link>
  </Nav.Item>}
  {props.openWidthHeight != "middle" &&
  <Nav.Item>
    <Nav.Link title="Half Size Window" onClick={() => {props.handleMiddlize(props.windowId)}}><FaRegWindowRestore/></Nav.Link>
  </Nav.Item>
  }
  {props.openWidthHeight != "maximum" &&
  <Nav.Item>
    <Nav.Link title="Maximize Window" onClick={() => {props.handleMaximize(props.windowId)}}><FaRegWindowMaximize/></Nav.Link>
  </Nav.Item>
  }
  <Nav.Item>
    <Nav.Link title="Close Window" onClick={() => {props.handleClose(props.windowId)}}><FaRegWindowClose/></Nav.Link>
  </Nav.Item>
  <Nav.Item>
    <Nav.Link title="Move Window" onClick={() => {props.handleSwitchWindow(props.windowId, props.windowType)}}>{props.windowType === "sideWindow" ? <FaAngleDoubleDown/> : <FaAngleDoubleLeft/>}</Nav.Link>
  </Nav.Item>


</Nav>

  );
}

export default WindowNavBar;
