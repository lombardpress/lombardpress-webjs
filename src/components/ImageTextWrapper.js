// Note this component is a near duplicate of Image Text Wrapper in Paleographinator
// TODO: This shoud be the target for a refactored independent React Component

import React, { Component } from 'react';
import Image from './Image';
import LineText from './LineText';

class ImageTextWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: ""
    }
  }
  render() {
    const getClass = () => {
      if (this.props.targetLabel === this.props.label){
        return "target"
      }
    }
    return (
      <div className="ImageTextWrapper" className={getClass()}>
        <div className="labelImageWrapper">

        <Image
          imageUrl={this.props.imageUrl}
          canvas={this.props.canvas}
          coords={this.props.coords}
          canvasShort={this.props.canvasShort}
          displayWidth={this.props.displayWidth}
          />
        </div>
        <LineText text={this.props.text}/>
      </div>
    );
  }
}

export default ImageTextWrapper;
