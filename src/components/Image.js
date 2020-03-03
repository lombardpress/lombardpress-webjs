import React from 'react';
import OSDInstance from './OSDInstance';
import PropTypes from 'prop-types';

// TODO: osd component makes this component fairly obsolute or a least exchangeable
function Image(props) {
  let newCoords = ""
  if (props.coords){
    const coordsSplitArray = props.coords.split(",")
    //const x = parseInt(coordsSplitArray[0]) - 20
    const x = parseInt(coordsSplitArray[0])
    const y = coordsSplitArray[1]
    //const w = parseInt(coordsSplitArray[2]) + 40
    const w = parseInt(coordsSplitArray[2])
    const h = coordsSplitArray[3]
    newCoords = x + "," + y + "," + w + "," + h
  }

  const imageLink = props.imageUrl + "/" + newCoords + "/" + props.displayWidth + ",/0/default.jpg"
  return (
      //<img alt="manuscript" src={imageLink}/>
      <OSDInstance imageurl={props.imageUrl} coords={props.coords} displayWidth={props.displayWidth} lineFocusCoords={props.lineFocusCoords}/>
  );
}

Image.propTypes = {
  /**
  * the Url for the image resource
  **/
  imageUrl: PropTypes.string.isRequired,
  /**
  * width of the image to be displayed
  *
  * TODO: might be better to make this a number/integer and not required;
  * when not preset perhaps it should just default to the widths listed in the coords
  **/
  displayWidth: PropTypes.string.isRequired,
  /**
  * string in the form of "x,y,w,h"
  *
  **/
  coords: PropTypes.string.isRequired
}
export default Image;
