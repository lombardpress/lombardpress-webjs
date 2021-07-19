import React from 'react';

import { FaAngleLeft, FaAngleRight, FaAngleUp} from 'react-icons/fa';
import Nav from 'react-bootstrap/Nav';

function NextPrevBar(props) {
  const handleUpArrow = () => {
    if (props.selectionRange && props.selectionRange.wordRange){
      props.handleBlockFocusChange(props.info.resourceid)
    }
    else{
      props.handleBlockFocusChange(props.info.parent)
    }
  }
  const getTitle = () => {
    if (props.selectionRange && props.selectionRange.wordRange){
      return props.info.title + "@" + props.selectionRange.wordRange.start + "-" + props.selectionRange.wordRange.end
    }
    else{
      return props.info.title
    }
  }
  const displayNextPrevBar = () => {
    if (props.info){
      return (
        <Nav variant="tabs">
        <Nav.Link onClick={() => {props.handleBlockFocusChange(props.info.resourceid)}}>{getTitle()}</Nav.Link>
        <Nav.Item>
          {(props.info.previous && props.info.previous !== "http://scta.info/resource/")  && <Nav.Link title="Move Up to Previous Sibling Resource" onClick={() => {props.handleBlockFocusChange(props.info.previous)}}><FaAngleLeft/></Nav.Link>}
        </Nav.Item>
        <Nav.Item>
          {(props.info.next && props.info.next !== "http://scta.info/resource/") && <Nav.Link title="Move Up to Next Sibling Resource" onClick={() => {props.handleBlockFocusChange(props.info.next)}}><FaAngleRight/></Nav.Link>}
        </Nav.Item>
        <Nav.Item>
          {(props.info.resourceid !== props.info.topLevel) && (props.info.parent !== "http://scta.info/resource/") 
          && <Nav.Link title="Move Up to Parent Resource" onClick={handleUpArrow}><FaAngleUp/></Nav.Link>}
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
