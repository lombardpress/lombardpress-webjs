import React from 'react';
import Surface from "./Surface"
import Surface2 from "./Surface2"
import XmlView from "./XmlView"
import Info from "./Info"
import WindowNavBar from "./WindowNavBar"
import NextPrevBar from "./NextPrevBar"
import TextCompare from "./TextCompare"
import SearchWrapper from "./SearchWrapper"



class Window extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      windowLoad: "",
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
      return(
        <div>
          {// including search wrapper here as hidden instead of above in switch, so that results don't have to be reload
          }
          <SearchWrapper info={this.props.info} hidden={this.state.windowLoad != "search"} topLevel={this.props.info.topLevel}/>
          <TextCompare info={this.props.info} hidden={this.state.windowLoad != "textCompare"}/>
          <XmlView info={this.props.info} hidden={this.state.windowLoad != "xml"}/>
          <Info info={this.props.info} topLevel={this.props.topLevel} hidden={this.state.windowLoad != "info"}/>
          <Surface2 surfaceid={this.props.surfaceid} topLevel={this.props.topLevel} handleSurfaceFocusChange={this.props.handleSurfaceFocusChange} hidden={this.state.windowLoad != "surface2"}/>
          {
            //<Surface surfaceid={this.props.surfaceid} topLevel={this.props.topLevel}/>
          }
        </div>
      )

    }
  return (
    <div className={this.props.windowType}>
      <WindowNavBar handleTabChange={this.props.handleTabChange}
      handleClose={this.props.handleClose}
      windowType={this.props.windowType}
      windowId={this.props.windowId}
      focus={this.props.resourceid}
      handleSwitchWindow={this.props.handleSwitchWindow}
      />
      <NextPrevBar info={this.props.info} handleBlockFocusChange={this.props.handleBlockFocusChange}/>

      {displayChild()}

    </div>
    );
  }
}

export default Window;
