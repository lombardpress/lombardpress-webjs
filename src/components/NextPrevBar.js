import React from 'react';

import { FaAngleLeft, FaAngleRight} from 'react-icons/fa';

import {NavLink} from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

function NextPrevBar(props) {
  return (
    <Nav variant="tabs">
    <Nav.Link onClick={() => {props.handleBlockFocusChange(props.info.resourceid)}}>{props.info.title}</Nav.Link>
    <Nav.Item>
      {(props.info.previous && props.info.previous !== "http://scta.info/resource/")  && <Nav.Link onClick={() => {props.handleBlockFocusChange(props.info.previous)}}><FaAngleLeft/></Nav.Link>}
    </Nav.Item>
    <Nav.Item>
      {(props.info.next && props.info.next !== "http://scta.info/resource/") && <Nav.Link onClick={() => {props.handleBlockFocusChange(props.info.next)}}><FaAngleRight/></Nav.Link>}
    </Nav.Item>

    </Nav>
  );
}

export default NextPrevBar;
