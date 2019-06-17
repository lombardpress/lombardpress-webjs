import React from 'react';

function CommentItem(props) {
  return (
    <div className="comment">
      <p>{props.n && props.n.body.value}</p>
      </div>
  );
}

export default CommentItem;
