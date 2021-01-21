import React from 'react';

import { FaAngleLeft, FaAngleRight, FaAngleUp} from 'react-icons/fa';
import Nav from 'react-bootstrap/Nav';

function NextPrevBar(props) {
  const displayNextPrevBar = () => {
    if (props.info){
      return (
        <Nav variant="tabs">
        <Nav.Link onClick={() => {props.handleBlockFocusChange(props.info.resourceid)}}>{props.info.title}</Nav.Link>
        <Nav.Item>
          {(props.info.previous && props.info.previous !== "http://scta.info/resource/")  && <Nav.Link title="Move Up to Previous Sibling Resource" onClick={() => {props.handleBlockFocusChange(props.info.previous)}}><FaAngleLeft/></Nav.Link>}
        </Nav.Item>
        <Nav.Item>
          {(props.info.next && props.info.next !== "http://scta.info/resource/") && <Nav.Link title="Move Up to Next Sibling Resource" onClick={() => {props.handleBlockFocusChange(props.info.next)}}><FaAngleRight/></Nav.Link>}
        </Nav.Item>
        <Nav.Item>
          {(props.info.parent && props.info.parent !== "http://scta.info/resource/") && <Nav.Link title="Move Up to Parent Resource" onClick={() => {props.handleBlockFocusChange(props.info.parent)}}><FaAngleUp/></Nav.Link>}
        </Nav.Item>
        </Nav>
      )
    }
    else{
      return null
    }
  }
  return (
    displayNextPrevBar()
  );
}

export default NextPrevBar;
