import React from 'react';
import Surface2 from "./Surface2"
import Surface3Wrapper from "./Surface3Wrapper"
import XmlView from "./XmlView"
import Info from "./Info"
import WindowNavBar from "./WindowNavBar"
import NextPrevBar from "./NextPrevBar"
import TextCompareWrapper from "./TextCompareWrapper"
import SearchWrapper from "./SearchWrapper"
import Comments from "./Comments"
import Citation from "./Citation"



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
      return(
        <div>
          {// including search wrapper here as hidden instead of above in switch, so that results don't have to be reload
          }
          <SearchWrapper info={this.props.info} hidden={this.state.windowLoad != "search"} topLevel={this.props.info.topLevel}/>
          <TextCompareWrapper info={this.props.info} relatedExpressions={this.props.relatedExpressions} hidden={this.state.windowLoad != "textCompare"}/>
          <XmlView info={this.props.info} hidden={this.state.windowLoad != "xml"}/>
          <Info info={this.props.info} relatedExpressions={this.props.relatedExpressions} topLevel={this.props.topLevel} hidden={this.state.windowLoad != "info"}/>
          <Citation info={this.props.info} relatedExpressions={this.props.relatedExpressions} topLevel={this.props.topLevel} hidden={this.state.windowLoad != "citation"}/>
          <Surface2 surfaceid={this.props.surfaceid} topLevel={this.props.topLevel} handleSurfaceFocusChange={this.props.handleSurfaceFocusChange} hidden={this.state.windowLoad != "surface2"}/>
          <Surface3Wrapper info={this.props.info} topLevel={this.props.topLevel} handleSurfaceFocusChange={this.props.handleSurfaceFocusChange} hidden={this.state.windowLoad != "surface3"}/>
          <Comments info={this.props.info} hidden={this.state.windowLoad != "comments"}/>
          {
            //<Surface surfaceid={this.props.surfaceid} topLevel={this.props.topLevel}/>
          }
        </div>
      )

    }

  return (
    <div className={this.props.windowType + " " + this.props.windowType + this.props.openWidthHeight}>
      <WindowNavBar handleTabChange={this.props.handleTabChange}
      handleClose={this.props.handleClose}
      handleMinimize={this.props.handleMinimize}
      handleMaximize={this.props.handleMaximize}
      handleMiddlize={this.props.handleMiddlize}
      windowType={this.props.windowType}
      openWidthHeight={this.props.openWidthHeight}
      windowId={this.props.windowId}
      focus={this.props.resourceid}
      handleSwitchWindow={this.props.handleSwitchWindow}
      handleDuplicateWindow={this.props.handleDuplicateWindow}
      altWindowState={this.props.altWindowState}
      />
      <NextPrevBar info={this.props.info} handleBlockFocusChange={this.props.handleBlockFocusChange}/>

      {displayChild()}

    </div>
    );
  }
}

export default Window;
