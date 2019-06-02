import React from 'react';

import {NavLink} from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

function NextPrevBar(props) {
  return (
    <Nav variant="tabs">
    <Nav.Link onClick={() => {props.handleBlockFocusChange(props.info.resourceid)}}>{props.info.title}</Nav.Link>
    <Nav.Item>
      {props.info.next && <Nav.Link onClick={() => {props.handleBlockFocusChange(props.info.next)}}>Next</Nav.Link>}
    </Nav.Item>
    <Nav.Item>
      {props.info.previous && <Nav.Link onClick={() => {props.handleBlockFocusChange(props.info.previous)}}>Previous</Nav.Link>}
    </Nav.Item>
    </Nav>
  );
}

export default NextPrevBar;
