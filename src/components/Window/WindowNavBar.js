import React from 'react';
import Nav from 'react-bootstrap/Nav';

import {FaRegWindowRestore, FaRegWindowMaximize, FaRegWindowMinimize, FaRegWindowClose, FaClone} from 'react-icons/fa';
// reimport these if you want to use the change window location functions: FaAngleDoubleDown, FaAngleDoubleLeft,

function WindowNavBar(props) {
  const displayTabs = () => {
    const tabs = props.availableTabs && props.availableTabs.map((t, idx) => {
      if (t.show){
        return (
          <Nav.Item key={"tab-" + t.name}>
            <Nav.Link active={props.windowLoad === t.name} title={t.description} onClick={() => {props.handleTabChange(t.name, props.windowId)}}>{t.icon}</Nav.Link>
          </Nav.Item>
        )
      }
      else{
        return null
      }
    })
    return tabs
  }
  return (
  <Nav variant="tabs">
    {displayTabs()}
  

  {props.openWidthHeight !== "minimum" &&
  <Nav.Item>
    <Nav.Link title="Minimize Window" onClick={() => {props.handleMinimize(props.windowId)}}><FaRegWindowMinimize/></Nav.Link>
  </Nav.Item>}
  {props.openWidthHeight !== "middle" &&
  <Nav.Item>
    <Nav.Link title="Half Size Window" onClick={() => {props.handleMiddlize(props.windowId)}}><FaRegWindowRestore/></Nav.Link>
  </Nav.Item>
  }
  {props.openWidthHeight !== "maximum" &&
  <Nav.Item>
    <Nav.Link title="Maximize Window" onClick={() => {props.handleMaximize(props.windowId)}}><FaRegWindowMaximize/></Nav.Link>
  </Nav.Item>
  }
  {props.windowId !== "window1"
  &&
  <Nav.Item>
    <Nav.Link title="Close Window" onClick={() => {props.handleClose(props.windowId)}}><FaRegWindowClose/></Nav.Link>
  </Nav.Item>
  }
  {/* commented to prevent window moving; this insures window 1 is always side window and window 2 is bottom window
    uncomment if this behavior is desired
    <Nav.Item>
    <Nav.Link title="Move Window" onClick={() => {props.handleSwitchWindow(props.windowId, props.windowType)}}>{props.windowType === "sideWindow" ? <FaAngleDoubleDown/> : <FaAngleDoubleLeft/>}</Nav.Link>
  </Nav.Item>
  */
  }
  <Nav.Item>
    {!props.altWindowState && <Nav.Link title="Clone Window" onClick={() => {props.handleDuplicateWindow(props.windowId, props.windowType)}}>{<FaClone/>}</Nav.Link>}
  </Nav.Item>


</Nav>

  );
}

export default WindowNavBar;
