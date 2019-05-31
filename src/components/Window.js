import React from 'react';
import Axios from "axios"
import Surface from "./Surface"
import Surface2 from "./Surface2"
import Info from "./Info"
import WindowNavBar from "./WindowNavBar"

class Window extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      windowLoad: ""
    }
  }

  componentDidMount(){
    this.setState({windowLoad: this.props.windowLoad})

  }
  componentWillReceiveProps(newProps){
    this.setState({windowLoad: newProps.windowLoad})

  }


  render(){
    const displayManifestations = () => {
      const newManifestations = this.state.manifestations.map((m) => {return <p>{m.value}</p>})
      return newManifestations
    }
    const displayChild = () => {
      switch(this.state.windowLoad){
        case "surface":
          return <Surface surfaceid={this.props.surfaceid} topLevel={this.props.topLevel}/>
        case "surface2":
          return <Surface2 surfaceid={this.props.surfaceid} topLevel={this.props.topLevel} handleSurfaceFocusChange={this.props.handleSurfaceFocusChange}/>
        case "info":
          return <Info resourceid={this.props.resourceid} topLevel={this.props.topLevel} handleBlockFocusChange={this.props.handleBlockFocusChange}/>
        default:
          return <h1>BottomWindow</h1>
      }

    }
  return (
    <div className={this.props.windowType}>
      <WindowNavBar handleTabChange={this.props.handleTabChange}
      handleClose={this.props.handleClose}
      windowType={this.props.windowType}
      focus={this.props.resourceid}
      handleSwitchWindow={this.props.handleSwitchWindow}
      />

      {displayChild()}
    </div>
    );
  }
}

export default Window;
