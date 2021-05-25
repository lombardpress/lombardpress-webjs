import React from 'react';
import {Link} from 'react-router-dom';
function Item(props) {
  const displayItem = () => {
    // conditions prevents attempt to render when props.item is not present
    if (props.item){
      return (
        <tr>
          {props.item.author && <td><Link to={"/text?resourceid=" + props.item.author}>{props.item.authorTitle}</Link></td>}
          <td><Link to={"/text?resourceid=" + props.item.id}>{props.item.title}</Link></td>
          {props.item.questionTitle && <td><Link to={"/text?resourceid=" + props.item.id}>{props.item.questionTitle}</Link></td>}
        </tr>
      )
    }
    else{
      return null
    }
  }
  return (
    displayItem()
  );
}

export default Item;
