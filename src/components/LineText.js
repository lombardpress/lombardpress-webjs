import React from 'react';

function LineText(props) {
  return (
    <div className="text" style={{"whiteSpace": "nowrap"}}>
     <span>{props.number}</span> <span dangerouslySetInnerHTML={{__html: props.text}} />
    </div>
  );
}

export default LineText;
