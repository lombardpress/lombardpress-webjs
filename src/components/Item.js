import React from 'react';
import {Link} from 'react-router-dom';
function Item(props) {
  //<p>{this.state.items[key].itemAuthor && <Link to={"/text?resourceid=" + this.state.items[key].itemAuthor}>{this.state.items[key].itemAuthorTitle}</Link>} |
  //<Link to={"/text?resourceid=" + this.state.items[key].item}>{this.state.items[key].title}:
  //{this.state.items[key].itemQuestionTitle}</Link></p>

  return (
    <tr>
      {props.item.author && <td><Link to={"/text?resourceid=" + props.item.author}>{props.item.authorTitle}</Link></td>}
      <td><Link to={"/text?resourceid=" + props.item.id}>{props.item.title}</Link></td>
      {props.item.questionTitle ? <td><Link to={"/text?resourceid=" + props.item.id}>{props.item.questionTitle}</Link></td> : <td/>}
    </tr>
  );
}

export default Item;
