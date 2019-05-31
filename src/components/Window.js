import React from 'react';
import Axios from "axios"
import Surface from "./Surface"
import Info from "./Info"

class Window extends React.Component {
  constructor(props){
    super(props)
  }
  componentDidMount(){
    
  }

  render(){
    const displayManifestations = () => {
      const newManifestations = this.state.manifestations.map((m) => {return <p>{m.value}</p>})
      return newManifestations
    }
    const displayChild = () => {
      console.log("top level", this.props.topLevel)
      switch(this.props.windowLoad){
        case "surface":
          return <Surface surfaceid={this.props.surfaceid} topLevel={this.props.topLevel}/>
        case "info":
          return <Info resourceid={this.props.resourceid} topLevel={this.props.topLevel}/>
        default:
          return <h1>BottomWindow</h1>
      }

    }
  return (
    <div className={this.props.windowType}>

      {displayChild()}
    </div>
    );
  }
}

export default Window;
