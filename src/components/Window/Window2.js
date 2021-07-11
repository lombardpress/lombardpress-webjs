import React from 'react';
import PropTypes from 'prop-types';
import Surface2 from "../Surface2"
import Surface3Wrapper from "../Surface3Wrapper"
import XmlView from "../XmlView"
import WindowNavBar from "./WindowNavBar"
import NextPrevBar from "../NextPrevBar"
import TextCompareWrapper from "../TextCompareWrapper"
import Search3 from "../Search3"
import PersonInfo from "../PersonInfo"
import Comments2 from "../Comments2"
import CitationWrapper from "../CitationWrapper"
import TextOutlineWrapper from "../TextOutlineWrapper"
import CodexToc from "../CodexToc"
import TextPreviewWrapper from "../TextPreviewWrapper"
import SurfaceInfo from "../SurfaceInfo"
import WorkGroupInfo from "../WorkGroupInfo"
import Dictionary from "../Dictionary"
import {getAvailableComponents} from "./WindowUtil"

import {FaSearch, FaGripVertical, FaCode, FaInfo, FaRegImage, FaComments, FaAlignLeft} from 'react-icons/fa';



class Window2 extends React.Component {
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
        citation: false
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
  componentDidUpdate(prevProps){
    //when receiving props we check first to see if a new resource id is present,
    // if so, mounting status for all window child components is set back to false
    let newMountStatus = {}
    if (this.props.resourceid !== prevProps.resourceid){
      newMountStatus = {
        textCompare: false,
        surface3: false,
        comments: false,
        xml: false,
        search:  false,
        textOutline: false,
        citation: false,
      }
      // then, the mount status of the opening window load is changed to true
      newMountStatus[this.props.windowLoad] = true
      this.setState(
        {windowLoad: this.props.windowLoad,
        mountStatus: newMountStatus}
      )
    }
    else if (this.props.windowLoad !== prevProps.windowLoad){
      const tempNewMount = this.state.mountStatus
      tempNewMount[this.props.windowLoad] = true
      newMountStatus = tempNewMount
      this.setState(
        {windowLoad: this.props.windowLoad,
        mountStatus: newMountStatus}
      )
    }
    else{
      newMountStatus = this.state.mountStatus
    }
  }

  render(){
    const displayTextPreviewWrappers = () => {
      //TODO: start and end numbers are not yet arrays
      // so the same start and end numbers will get sent to each item
      const items = this.props.textPreviewObjects.map((i, index) => {
        return (
          <TextPreviewWrapper key={index}
        textPreviewResourceId={i.id} 
        textPreviewStart={i.range ? i.range.split("-")[0] : null} 
        textPreviewEnd={i.range ? i.range.split("-")[1] : null} 
        handleFocusChange={this.props.handleFocusChange} 
        hidden={this.state.windowLoad !== "textPreview"}
        handleTextPreviewFocusChange={this.props.handleTextPreviewFocusChange}
        referringResource={this.props.info.ctranscription}
        referringSelectionRange={this.props.selectionRange}
        />
        )
      })
      return items
    }
    const displayChild = () => {
      //NOTE possible state machine pattern based on focus structureType
      //different options should be available depending on the focus structureType
      
      //const structureType = this.props.info.structureType
      //const isCollection = structureType === "http://scta.info/resource/structureCollection" || false

      
      //TODO: use of props.info, itemFocus, focusResearceid, resourceid vs info.resourceid needs to be better organized and clarified
      //props.info.resourceid seems redundant with props.resourceid; doesn't seem to do any harm
      // but in this component props.info will not always be available so props.resourceid should be used. 
      

      const displayComponents = getAvailableComponents(this.props.resourceType)
      return(
        <div>
          
          {
            // NOTE: performance seems a lot better when these mount only when clicked on
            // some downside as it was nice to have them pre-loaded
            // and the state doesn't remain when leaving tab and returning back to tab.
            // for this reason search is always loaded, so that search results remain when moving between tabs.
            // a compromise approach could be made for similar resources, where some components are dismounted and some are hiddden
          }
            {
            displayComponents.includes("textCompare")
            && 
            (this.state.windowLoad === "textCompare" || this.state.mountStatus.textCompare) 
            && 
            <TextCompareWrapper 
              info={this.props.info}  
              surfaceWidth={this.props.windowType === 'bottomWindow' ? "1000" : "501"}
              hidden={this.state.windowLoad !== "textCompare"}
              selectionRange={this.props.selectionRange}
            />
            }
            {
            displayComponents.includes("textCitation") 
            && 
            (this.state.windowLoad === "citation" || this.state.mountStatus.citation) 
            &&
            <CitationWrapper tresourceid={this.props.info.resourceid + this.props.mtFocus} 
            manifestations={this.props.info.manifestations} 
            handleFocusChange={this.props.handleFocusChange} 
            hidden={this.state.windowLoad !== "citation"}
            selectionRange={this.props.selectionRange}
            />
            }
            {
            displayComponents.includes("personInfo") 
            && 
            (this.state.windowLoad === "citation" || this.state.mountStatus.citation) 
            && 
            <PersonInfo 
              resourceid={this.props.resourceid} 
              hidden={this.state.windowLoad !== "citation"}
            />
            }
            {
            displayComponents.includes("workGroupInfo") 
            && 
            (this.state.windowLoad === "citation" || this.state.mountStatus.citation) 
            && 
            <WorkGroupInfo 
              resourceid={this.props.resourceid} 
              hidden={this.state.windowLoad !== "citation"}
            />
            }
            {
            displayComponents.includes("codex") 
            && 
            (this.state.windowLoad === "textCompare" || this.state.mountStatus.textCompare) 
            && 
            <SurfaceInfo 
              surfaceid={this.props.surfaceid} 
              resourceid={this.props.resourceid} 
              codexResourceType={this.props.codexResourceType}
              hidden={this.state.windowLoad !== "textCompare"}
            />
            }
            {
            displayComponents.includes("surface3")  
            && 
            (this.state.windowLoad === "surface3" || this.state.mountStatus.surface3) 
            &&  
            <Surface3Wrapper
            manifestations={this.props.info.manifestations}
            focusedManifestation={this.props.defaultManifestationSlug ? this.props.resourceid + "/" + this.props.defaultManifestationSlug : this.props.resourceid + "/" + this.props.mtFocus.split("/")[1]}
            annotationsDisplay={this.props.annotationsDisplay}
            handleToggleTextLinesView={this.handleToggleTextLinesView}
            handleChangeManifestation={this.handleChangeManifestation}
            width={this.props.windowType === 'bottomWindow' ? "1000" : "501"}
            lineFocusId={this.props.lineFocusId}
            hidden={this.state.windowLoad !== "surface3"}/>
            }
            
            {
              displayComponents.includes("comments")  
              &&
              (this.state.windowLoad === "comments" || this.state.mountStatus.comments) 
              &&  
              <Comments2 
                resourceid={this.props.resourceid + this.props.mtFocus}
                expressionid={this.props.resourceid} 
                hidden={this.state.windowLoad !== "comments"}
                selectionRange={this.props.selectionRange} // this will only apply at resourceType=text level
              />
            }
            {displayComponents.includes("xml") 
            && (this.state.windowLoad === "xml" || this.state.mountStatus.xml) 
            &&  
            <XmlView 
            tresourceid={this.props.info ? this.props.info.resourceid + this.props.mtFocus : this.props.itemFocus.expression + this.props.mtFocus} 
            hidden={this.state.windowLoad !== "xml"}/>
            }
          {
            //NOTE: always load outline (i.e. don't check mountStatus) since it reduces number of calls, as most info is the same for all paragraphs
          }
          {
          displayComponents.includes("textOutlineWrapper") 
          &&
          <TextOutlineWrapper 
            focusResourceid={this.props.info ? this.props.info.resourceid : this.props.itemFocus.expression} 
            resourceid={this.props.info.topLevel} 
            title={this.props.info.topLevel} 
            hidden={this.state.windowLoad !== "textOutlineWrapper"} 
            mtFocus={this.props.mtFocus}
            collectionLink={true}/> 
          }
          {
          displayComponents.includes("codexToc") 
          &&
          <CodexToc 
            resourceid={this.props.resourceid}
            codexResourceType={this.props.codexResourceType}
            hidden={this.state.windowLoad !== "citation"} 
          />
          }
          {
            //NOTE: always load search (i.e. don't check mountStatus) to keep search results present even when navigating two different tabs
          }
          { displayComponents.includes("search") 
          &&
          <Search3
            hidden={this.state.windowLoad !== "search"}
            searchEid={this.props.info ? this.props.info.topLevel : this.props.resourceType === "collection" && this.props.resourceid}
            searchAuthor={this.props.info ? this.props.info.author : this.props.resourceType === "person" && this.props.resourceid} 
            searchEType={this.props.resourceType === "expressionType" && this.props.resourceid}
            searchWorkGroup={this.props.resourceType === "workGroup" && this.props.resourceid}
            searchType="text"
            showSubmit={true}
            showAdvancedParameters={true}
            showLabels={false}
            searchTerm={(this.props.selectionRange && this.props.selectionRange.text) ? '"' + this.props.selectionRange.text + '"' : ""}
            />
          }
          
          {
            // text preview wrapper -- loads a text preview from expression resource id
            this.state.windowLoad === "textPreview" &&  displayTextPreviewWrappers()
          }
          {
            (this.state.windowLoad === "dictionary" && this.props.selectionRange.text) &&
            <Dictionary text={this.props.selectionRange.text} hidden={this.state.windowLoad !== "dictionary"}/>
          }
          {
            this.state.windowLoad === "surface2" 
            &&  
            <Surface2 
              surfaceid={this.props.surfaceid} 
              lineFocusId={this.props.lineFocusId} 
              topLevel={this.props.info.topLevel} 
              handleSurfaceFocusChange={this.props.handleSurfaceFocusChange} 
              handleLineFocusChange={this.props.handleLineFocusChange} 
              hidden={this.state.windowLoad !== "surface2"}
            />
            }
        </div>
      )

    }
  
    // TODO/NOTE: perhaps tabs should be pushed to array with component above; the same logic should apply to component as 
    // to its corresponding tab. So this should really be done once instead of twice.
    const getAvailableTabs = () => {
      const displayComponents = getAvailableComponents(this.props.resourceType)
      return [
      {
        name: "citation",
        desc: "Text Citation",
        show: displayComponents.includes("textCitation") 
        || displayComponents.includes("textCitation")
        || displayComponents.includes("personInfo")
        || displayComponents.includes("codexToc")
        || displayComponents.includes("workGroupInfo"),
        icon: <FaInfo/>
      },
      {
        name: "surface3",
        desc: "Images",
        show: displayComponents.includes("surface3"),
        icon: <FaRegImage/>
      },
      {
        name: "xml",
        desc: "Text XML Source",
        show: displayComponents.includes("xml"),
        icon: <FaCode/>
      },
      {
        name: "textCompare",
        desc: "Text Comparisons",
        show: displayComponents.includes("textCompare")
        || displayComponents.includes("codex"),
        icon: <FaGripVertical/>
      },
      {
        name: "comments",
        desc: "Comments",
        show: displayComponents.includes("comments"),
        icon: <FaComments/>
      },
      {
        name: "textOutlineWrapper",
        desc: "Text Outline",
        show: displayComponents.includes("textOutlineWrapper"),
        icon: <FaAlignLeft/>
      },
      {
        name: "search",
        desc: "Text Search",
        show: displayComponents.includes("search"),
        icon: <FaSearch/>
      }
    ]
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
      availableTabs={getAvailableTabs()}
      />
      {(this.state.windowLoad !== "surface2" && this.state.windowLoad !== "dictionary" ) 
      && <NextPrevBar info={this.props.info} handleBlockFocusChange={this.props.handleBlockFocusChange}/>}

      {displayChild()}

    </div>
    );
  }
}

Window2.propTypes = {
  /**
  * Window Component
  * 
  * 
  **/
  handleClose: PropTypes.func, //={this.handleClose}
  handleMinimize: PropTypes.func, //{this.handleMinimize}
  handleMaximize: PropTypes.func, //{this.handleMaximize}
  handleMiddlize: PropTypes.func, //{this.handleMiddlize} //TODO these functions could be reduced to window resize object
  handleTabChange: PropTypes.func, //{this.handleTabChange}
  handleBlockFocusChange: PropTypes.func, //={this.setFocus} //TODO this should be replaced by handleFocusChange
  handleFocusChange: PropTypes.func, //={this.setFocus2} //TODO this should replace handleBlockFocusChange
  handleSurfaceFocusChange: PropTypes.func, //={this.handleSurfaceFocusChange}
  handleSwitchWindow: PropTypes.func, //={this.handleSwitchWindow}
  handleDuplicateWindow: PropTypes.func, //{this.handleDuplicateWindow}
  resourceid: PropTypes.string, //={this.state.focus ? this.state.focus.resourceid : this.props.resourceid}
  windowType: PropTypes.string, //={this.state.windows[key].position}
  windowId: PropTypes.string, //={this.state.windows[key].windowId}
  windowLoad: PropTypes.string, //{this.state.windows[key].windowLoad}
  openWidthHeight: PropTypes.string, //{this.state.windows[key].openWidthHeight}
  surfaceid: PropTypes.string, // {this.state.surfaceid}
  lineFocusId: PropTypes.string, //{this.state.lineFocusId}
  //info: PropTypes.object, // {this.state.focus} 
  //itemFocus: PropTypes.string, // ={this.state.itemFocus} //Todo standardize this as scta url id, instead of short id
  altWindowState: PropTypes.bool, // {this.state.windows[key].windowId === "window1" ? this.state.windows["window2"].open : this.state.windows["window1"].open} TODO could this be combined as part of a windowsParameter Object
  mtFocus: PropTypes.string, //{this.state.mtFocus}
  handleToggleTextLinesView: PropTypes.func, //={this.handleToggleTextLinesView}
  annotationsDisplay: PropTypes.string, //{this.state.windows[key].annotationsDisplay} //TODO; reduce and combine by just passing windows[key]
  handleChangeManifestation: PropTypes.func, //{this.handleChangeManifestation}
  defaultManifestationSlug: PropTypes.string, //={this.state.windows[key].defaultManifestationSlug}: TODO as part of windows object pass
  textPreviewObjects: PropTypes.array, //{this.state.textPreviewObjects}
  handleTextPreviewFocusChange: PropTypes.func, //{this.handleTextPreviewFocusChange}
  handleLineFocusChange: PropTypes.func, //{this.handleLineFocusChange}
  selectionRange: PropTypes.object //{this.state.selectionRange}
}

export default Window2;
