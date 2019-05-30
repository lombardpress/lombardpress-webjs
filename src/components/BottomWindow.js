import React from 'react';
import Surface from "./Surface"



function BottomWindow(props) {
  return (
    <div className={"BottomWindow"}>
    {props.resourceType === "surface" ? <Surface resourceid={props.resourceid} topLevel={props.topLevel}/> : <h1>BottomWindow</h1>}
    </div>
  )
}

export default BottomWindow;
