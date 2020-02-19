import React from 'react';

function LineText(props) {
  return (
    <div className="text" style={{"whiteSpace": "nowrap"}}>
    {props.number && <span>{props.label.split("(")[0]}/</span>}     
    {props.number && <span>{props.number}</span>}
    <span dangerouslySetInnerHTML={{__html: props.text}} />
    </div>
  );
}

export default LineText;
