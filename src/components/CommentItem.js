import React from 'react';

function CommentItem(props) {
  return (
    <div className="comment">
     {
       props.n.motivation === "discussing"
       ? <p>{props.n.body.value} at: <a href={props.n.body.id} target="_blank" rel="noopener noreferrer">{props.n.body.id}</a></p>
       : <p>{props.n && props.n.body.value}</p>
     }
    </div>
  );
}

export default CommentItem;
