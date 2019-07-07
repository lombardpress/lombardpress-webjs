import React from 'react';

function Image(props) {
  let newCoords = ""
  if (props.coords){
    const coordsSplitArray = props.coords.split(",")
    const x = parseInt(coordsSplitArray[0]) - 20
    const y = coordsSplitArray[1]
    const w = parseInt(coordsSplitArray[2]) + 40
    const h = coordsSplitArray[3]
    newCoords = x + "," + y + "," + w + "," + h
    console.log(newCoords)
  }

  const imageLink = props.imageUrl + "/" + newCoords + "/" + props.displayWidth + ",/0/default.jpg"
  return (
    <img alt="manuscript" src={imageLink}/>
  );
}

export default Image;
