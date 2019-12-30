import React from 'react';
import Surface2 from "./Surface2"
import Surface3Wrapper from "./Surface3Wrapper"
import XmlView from "./XmlView"
//import Info from "./Info"
import WindowNavBar from "./WindowNavBar"
import NextPrevBar from "./NextPrevBar"
import TextCompareWrapper from "./TextCompareWrapper"
import SearchWrapper from "./SearchWrapper"
import Search3 from "./Search3"
import Comments from "./Comments"
import Comments2 from "./Comments2"
import CitationWrapper from "./CitationWrapper"
import TextOutlineWrapper from "./TextOutlineWrapper"
import TextPreviewWrapper from "./TextPreviewWrapper"




class Window extends React.Component {
  constructor(props){
    super(props)
    this.handleToggleTextLinesView = this.handleToggleTextLinesView.bind(this)
    this.handleChangeManifestation = this.handleChangeManifestation.bind(this)
    this.state = {
      windowLoad: "",
      mountStatus: {
        textCompare: false,
        surface3: false,
        comments: false,
        xml: false,
        search:  false,
        textOutline: false,
        citation: false,
        search: false
      }

    }
  }
  // used to control default iamge view prop for surface3 component
  handleToggleTextLinesView(view){
    this.props.handleToggleTextLinesView(this.props.windowId, view)
  }
  // used to control default manifestation prop for surface3 component
  handleChangeManifestation(manifestation){
    // to do getting manifestation slug, to apply as default view
    // TODO: it is precarious to get info like this by deconstructing identifier
    // it would better if this information were being passed from original db look up
    const manifestationSlug = manifestation.split("/resource/")[1].split("/")[1]
    this.props.handleChangeManifestation(this.props.windowId, manifestationSlug)
  }
  componentDidMount(){
    this.setState(
      {windowLoad: this.props.windowLoad}
    )


  }
  componentWillReceiveProps(newProps){
    //when receiving props we check first to see if a new resource id is present,
    // if so, mounting status for all window child components is set back to false
    let newMountStatus = {}
    if (newProps.info.resourceid !== this.props.info.resourceid){
      newMountStatus = {
        textCompare: false,
        surface3: false,
        comments: false,
        xml: false,
        search:  false,
        textOutline: false,
        citation: false,
        search: false
      }
      // then, the mount status of the opening window load is changed to true
      newMountStatus[newProps.windowLoad] = true
    }
    //now set mount status of components that should only remount if topLevel Resource id changes
    else if (newProps.topLevel !== this.props.topLevel){
      newMountStatus = {
        search: false
      }
    }
    // if the resource id has not chnaged, but only the windowLoad
    // we change the window mount status to true, to prevent mounting as long as the resource id has not changed
    else if (newProps.windowLoad !== this.props.windowLoad){
      const tempNewMount = this.state.mountStatus
      tempNewMount[newProps.windowLoad] = true
      newMountStatus = tempNewMount
    }
    else{
      newMountStatus = this.state.mountStatus
    }
    this.setState(
      {windowLoad: newProps.windowLoad,
      mountStatus: newMountStatus}
    )
  }


  render(){
    const displayChild = () => {
      return(
        <div>

          {// components that are only avialable if blockDiv focus and this.props.info is set
            this.props.info &&
          <div>
          {
            // NOTE: performance seems a lot better when these mount only when clicked on
            // some downside as it was nice to have them pre-loaded
            // and the state doesn't remain when leaving tab and returning back to tab.
            // for this reason search is always loaded, so that search results remain when moving between tabs.
            // a compromise approach could be made for similar resources, where some components are dismounted and some are hiddden
          }
            {(this.state.windowLoad === "textCompare" || this.state.mountStatus.textCompare) && <TextCompareWrapper info={this.props.info} relatedExpressions={this.props.relatedExpressions} hidden={this.state.windowLoad !== "textCompare"}/>}
            {
              //this.state.windowLoad === "info" &&  <Info info={this.props.info} relatedExpressions={this.props.relatedExpressions} topLevel={this.props.topLevel} hidden={this.state.windowLoad !== "info"}/>
            }
            {
              //always load search to keep search results present even when navigating two diffferent tabs
              // uncomment to prevent auto mounting this.state.windowLoad === "citation" &&
            }
            {(this.state.windowLoad === "citation" || this.state.mountStatus.citation) && <CitationWrapper tresourceid={this.props.info.resourceid + this.props.mtFocus} manifestations={this.props.info.manifestations} handleFocusChange={this.props.handleFocusChange} hidden={this.state.windowLoad !== "citation"}/>}
            {this.state.windowLoad === "surface2" &&  <Surface2 surfaceid={this.props.surfaceid} lineFocusId={this.props.lineFocusId} topLevel={this.props.topLevel} handleSurfaceFocusChange={this.props.handleSurfaceFocusChange} hidden={this.state.windowLoad !== "surface2"}/>}
            {(this.state.windowLoad === "surface3" || this.state.mountStatus.surface3) &&  <Surface3Wrapper
            manifestations={this.props.info.manifestations}
            focusedManifestation={this.props.defaultManifestationSlug ? this.props.resourceid + "/" + this.props.defaultManifestationSlug : this.props.resourceid + "/" + this.props.mtFocus.split("/")[1]}
            annotationsDisplay={this.props.annotationsDisplay}
            handleToggleTextLinesView={this.handleToggleTextLinesView}
            handleChangeManifestation={this.handleChangeManifestation}
            width={this.props.windowType === 'bottomWindow' ? "1000" : "501"}
            hidden={this.state.windowLoad !== "surface3"}/>}

            {
              //(this.state.windowLoad === "comments" || this.state.mountStatus.comments) &&  <Comments resourceid={this.props.info.resourceid} inbox={this.props.info.inbox} hidden={this.state.windowLoad !== "comments"}/>
            }
            {
              (this.state.windowLoad === "comments" || this.state.mountStatus.comments) &&  <Comments2 resourceid={this.props.info.resourceid} hidden={this.state.windowLoad !== "comments"}/>
            }
          </div>
          }
          {
            //TODO: use of info, topLevel, itemFocus, focusResearceid, resourceid, needs to be better organized and clarified
          }
          {(this.state.windowLoad === "xml" || this.state.mountStatus.xmls) &&  <XmlView tresourceid={this.props.info ? this.props.info.resourceid + this.props.mtFocus : this.props.itemFocus.expression + this.props.mtFocus} hidden={this.state.windowLoad !== "xml"}/>}
          {
            //always load outline since it reduces number of calls, as most info is the same for all paragraphs
          }
          <TextOutlineWrapper focusResourceid={this.props.info ? this.props.info.resourceid : this.props.itemFocus.expression} resourceid={this.props.topLevel} title={this.props.topLevel} hidden={this.state.windowLoad !== "textOutlineWrapper"} mtFocus={this.props.mtFocus}/>
          {
            //always load search to keep search results present even when navigating two diffferent tabs
          }
          {
            //<SearchWrapper hidden={this.state.windowLoad !== "search"} topLevel={this.props.topLevel} authorId={this.props.info.author}/>
          }
          {(this.state.windowLoad === "search" || this.state.mountStatus.search) &&
          <Search3
            hidden={this.state.windowLoad !== "search"}
            searchEid={this.props.topLevel}
            searchAuthor={this.props.info.author}
            searchType="text"
            showSubmit={true}
            showAdvancedParameters={true}
            showLabels={false}/>
          }
          {
            //<Surface surfaceid={this.props.surfaceid} topLevel={this.props.topLevel}/>
          }
          {
            // text preview wrapper -- loads a text preview from expression resource id
            this.state.windowLoad === "textPreview" &&  <TextPreviewWrapper textPreviewResourceId={this.props.textPreviewResourceId} handleFocusChange={this.props.handleFocusChange} hidden={this.state.windowLoad !== "textPreview"}/>
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
      windowLoad={this.props.windowLoad}
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
