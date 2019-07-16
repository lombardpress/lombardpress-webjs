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
import TextOutlineWrapper from "./TextOutlineWrapper"



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
    const displayChild = () => {
      return(
        <div>

          {// components that are only avialable if blockDiv focus and this.props.info is set
            this.props.info &&
          <div>
            <TextCompareWrapper info={this.props.info} relatedExpressions={this.props.relatedExpressions} hidden={this.state.windowLoad !== "textCompare"}/>
            <XmlView info={this.props.info} hidden={this.state.windowLoad !== "xml"}/>
            <Info info={this.props.info} relatedExpressions={this.props.relatedExpressions} topLevel={this.props.topLevel} hidden={this.state.windowLoad !== "info"}/>
            <Citation info={this.props.info} relatedExpressions={this.props.relatedExpressions} topLevel={this.props.topLevel} mtFocus={this.props.mtFocus} hidden={this.state.windowLoad !== "citation"}/>
            <Surface2 surfaceid={this.props.surfaceid} lineFocusId={this.props.lineFocusId} topLevel={this.props.topLevel} handleSurfaceFocusChange={this.props.handleSurfaceFocusChange} hidden={this.state.windowLoad !== "surface2"}/>
            <Surface3Wrapper info={this.props.info} topLevel={this.props.topLevel} handleSurfaceFocusChange={this.props.handleSurfaceFocusChange} hidden={this.state.windowLoad !== "surface3"}/>
            <Comments info={this.props.info} hidden={this.state.windowLoad !== "comments"}/>
          </div>
          }
          {
            //TODO: use of info, topLevel, itemFocus, focusResearceid, resourceid, needs to be better organized and clarified
          }
          <TextOutlineWrapper focusResourceid={this.props.info ? this.props.info.resourceid : this.props.itemFocus.expression} resourceid={this.props.topLevel} title={this.props.topLevel} hidden={this.state.windowLoad !== "textOutlineWrapper"} mtFocus={this.props.mtFocus}/>
          <SearchWrapper hidden={this.state.windowLoad !== "search"} topLevel={this.props.topLevel}/>
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
      focusSet={!!this.props.info}
      />
      <NextPrevBar info={this.props.info} handleBlockFocusChange={this.props.handleBlockFocusChange}/>

      {displayChild()}

    </div>
    );
  }
}

export default Window;
