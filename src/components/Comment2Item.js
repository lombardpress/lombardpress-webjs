import React from 'react';
import {Link} from 'react-router-dom';

function Comment2Item(props) {
  return (
      <div>
        {!props.focused && <p>For: <Link to={"/text?resourceid=" + props.comment.target}>{props.comment.target}</Link></p>}
        <p>{props.comment.body.value} | {props.comment.created && props.comment.created.split("T")[0]}</p>
        <hr/>
      </div>
    );
}

export default Comment2Item;
