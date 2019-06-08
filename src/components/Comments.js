import React from 'react';

function Comments(props) {
  return (
    <div className={props.hidden ? "hidden" : "showing"}>
    <h1>Comments</h1>

    </div>
  );
}

export default Comments;
