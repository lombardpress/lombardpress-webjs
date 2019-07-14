import React from 'react';
import {Link} from 'react-router-dom';

function CodexListItem(props) {
  return (
    <p><Link to={"/text?resourceid=" + props.codexid}>{props.title}</Link></p>
  );
}

export default CodexListItem;
