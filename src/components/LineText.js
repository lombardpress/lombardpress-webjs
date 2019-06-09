import React from 'react';

function LineText(props) {
  return (
    <div className="text" style={{"white-space": "nowrap"}}>
     <span dangerouslySetInnerHTML={{__html: props.text}} />
    </div>
  );
}

export default LineText;
