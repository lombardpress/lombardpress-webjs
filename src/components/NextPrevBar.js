import React from 'react';

function NextPrevBar(props) {
  return (
    <div>
      <p>Title: {props.info.title}</p>
      {props.info.next && <p onClick={() => {props.handleBlockFocusChange(props.info.next)}}>Next</p>}
      {props.info.previous && <p onClick={() => {props.handleBlockFocusChange(props.info.previous)}}>Previous</p>}
    </div>
  );
}

export default NextPrevBar;
