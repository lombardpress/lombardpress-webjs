import React from 'react';
import Container from 'react-bootstrap/Container';


import Window from "./Window"
import TextNavBar from "./TextNavBar"
import Text from "./Text"
import VersionChain from "./VersionChain"
import {runQuery, scrollToParagraph} from './utils'

import {getRelatedExpressions, basicInfoQuery, itemTranscriptionInfoQuery} from './Queries'


class TextWrapper extends React.Component {
  constructor(props){
    super(props)
    this.mount = false
    this.openWindow = this.openWindow.bind(this)
    this.setFocus = this.setFocus.bind(this)
    this.handleTabChange = this.handleTabChange.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleMinimize = this.handleMinimize.bind(this)
    this.handleMaximize = this.handleMaximize.bind(this)
    this.handleMiddlize = this.handleMiddlize.bind(this)
    this.handleSwitchWindow = this.handleSwitchWindow.bind(this)
    this.handleDuplicateWindow = this.handleDuplicateWindow.bind(this)
    this.handleSurfaceFocusChange = this.handleSurfaceFocusChange.bind(this)
    this.state = {
      doc: "",
      focus: "",
      //focusRelatedExpressions: "",
      itemFocus: "",
      surfaceid: "",
      windows: {
        window1: {
          windowId: "window1",
          open: false,
          windowLoad: "info",
          position: "sideWindow",
          openWidthHeight: "middle"
        },
        window2: {
          windowId: "window2",
          open: false,
          windowLoad: "info",
          position: "bottomWindow",
          openWidthHeight: "middle"
        }
      }
    }
  }
  openWindow(id, windowLoad){
    if (!this.state.windows[id].open){
      this.setState((prevState) => {
        const windows = prevState.windows
        windows[id].open = true
        windows[id].windowLoad = windowLoad
        return {
          windows: windows,
        }
      })
    }
  }
  handleClose(windowId){
    this.setState((prevState) => {
      const windows = prevState.windows
      windows[windowId].open = false
      return {windows: windows}

    })
    //scroll is supposed to re-align text scroll to focused paragraph after side bar close.
    //but it is not quite working
    scrollToParagraph(this.state.blockFocus, true)

  }
  handleMinimize(windowId){
    this.setState((prevState) => {
      const windows = prevState.windows
      windows[windowId].openWidthHeight = "minimum"
      return {windows: windows}

    })
  }
  handleMaximize(windowId){
    this.setState((prevState) => {
      const windows = prevState.windows
      windows[windowId].openWidthHeight = "maximum"
      return {windows: windows}

    })
  }
  handleMiddlize(windowId){
    this.setState((prevState) => {
      const windows = prevState.windows
      windows[windowId].openWidthHeight = "middle"
      return {windows: windows}

    })
  }
  handleSwitchWindow(windowId, windowType){
    this.setState((prevState) => {
      const windows = prevState.windows
      if (windows[windowId].position === "sideWindow"){
        windows[windowId].position = "bottomWindow"
        // these conditionals control whether an already existing window will be closed when the other is moved
        // while commented they allow window1 and window2 to stack on top of each other

        // if (windowId === "window1"){
        //   windows["window2"].open = false
        // }
        // else if ((windowId === "window2")){
        //   windows["window1"].open = false
        // }
      }
      else if (windows[windowId].position === "bottomWindow"){
        windows[windowId].position = "sideWindow"
        // these conditionals control whether an already existing window will be closed when the other is moved
        // while commented they allow window1 and window2 to stack on top of each other

        // if (windowId === "window1"){
        //   windows["window2"].open = false
        // }
        // else if ((windowId === "window2")){
        //   windows["window1"].open = false
        // }
      }
      return {windows: windows}

    })
  }
  handleDuplicateWindow(windowId, windowType){
    this.setState((prevState) => {
      const windows = prevState.windows
      const altWindowId = windowId === "window1" ? "window2" : "window1"
      if (windows[windowId].position === "sideWindow"){
        windows[altWindowId].position = "bottomWindow"
        windows[altWindowId].open = true
      }
      else if (windows[windowId].position === "bottomWindow"){
        windows[altWindowId].position = "sideWindow"
        windows[altWindowId].open = true
      }
      return {windows: windows}
    })
  }
  handleTabChange(windowLoad, windowId){

    this.setState((prevState) => {
      const windows = prevState.windows
      windows[windowId].windowLoad = windowLoad
      return {windows: windows}

    })

  }

  handleSurfaceFocusChange(surfaceid){
    this.setState({surfaceid: surfaceid})
  }
  setFocus(id){
    const fullid = id.includes("http") ? id : "http://scta.info/resource/" + id
    this.props.handleUpdateUrlResource(fullid)
  }


  retrieveFocusInfo(id){
    const fullid = id.includes("http") ? id : "http://scta.info/resource/" + id
    // get info
    const info = runQuery(basicInfoQuery(fullid))
    //arrange info and set it to state

    this.arrangeFocusInfo(info, fullid)
    // get related expressions info
    // removed these second calls and embed the query in arrange focus info to keep information in sync.
    // TODO remove below three lines
    //const relatedExpressions = runQuery(getRelatedExpressions(fullid))
    //arrange info and set it to state
    //this.arrangeFocusRelatedInfo(relatedExpressions)

    //scrollToParagraph(shortid, true)

  }

  arrangeFocusInfo(info, resourceid){
      info.then((d) => {
        const bindings = d.data.results.bindings[0]
        const manifestations = d.data.results.bindings.map((b) => {
          return {
            manifestation: b.manifestation.value,
            manifestationTitle: b.manifestationTitle.value,
            transcription: b.manifestationCTranscription.value
          }
        })
        // TODO the need for this 2nd query and async call might
        // be able to be removed using a construct query
        // see example pattern in articles collection
        const relatedExpressions = runQuery(getRelatedExpressions(resourceid))
        relatedExpressions.then((d) => {
          const bindings2 = d.data.results.bindings
          const relatedExpressions = bindings2.map((r) => {
              return {
                resourceid: r.isRelatedTo.value,
                relationLabel: r.label.value
              }
            });

          if (this.mount){
            this.setState({
              focus: {
                resourceid: resourceid,
                title: bindings.title.value,
                structureType: bindings.structureType.value,
                inbox: bindings.inbox.value,
                next: bindings.next ? bindings.next.value : "",
                previous: bindings.previous ? bindings.previous.value : "",
                cdoc: bindings.cdoc.value,
                cxml: bindings.cxml.value,
                topLevel: bindings.topLevelExpression.value,
                cmanifestation: bindings.cmanifestation.value,
                ctranscription: bindings.ctranscription.value,
                manifestations: manifestations,
                relatedExpressions: relatedExpressions
              }
            });
          }
        })
      });
    }
  // embeded this within arrang focus info, so that information remains in sync
  // TODO remove this
    // arrangeFocusRelatedInfo(relatedInfo){
    //     relatedInfo.then((d) => {
    //       console.log("new data", d)
    //       const bindings = d.data.results.bindings
    //       const relatedExpressions = bindings.map((r) => {
    //           return {
    //             resourceid: r.isRelatedTo.value,
    //             relationLabel: r.label.value
    //           }
    //         });
    //     if (this.mount){
    //       this.setState({
    //         focusRelatedExpressions: relatedExpressions
    //       });
    //       }
    //     });
    //   }
    setItemFocus(id){
      const fullid = id.includes("http") ? id : "http://scta.info/resource/" + id
      // get info
      const info = runQuery(itemTranscriptionInfoQuery(fullid))
      this.arrangeItemFocusInfo(info)
    }
    arrangeItemFocusInfo(itemFocusInfo){
        itemFocusInfo.then((d) => {
          const bindings = d.data.results.bindings[0]
          if (this.mount){
            this.setState({
              itemFocus: {
                title: bindings.title.value,
                manifestation: bindings.manifestation.value,
                expression: bindings.expression.value,
                doc: bindings.doc.value,
                xml: bindings.xml.value,
                next: bindings.next ? bindings.next.value : "",
                previous: bindings.previous ? bindings.previous.value : "",
                inbox: bindings.inbox.value,
                topLevel: bindings.topLevelExpression.value,
                transcriptionid: bindings.t.value
              }
            });
          }
        });
      }

  componentDidMount(){
    this.mount = true
    this.setItemFocus(this.props.transcriptionid)
    if (this.props.blockDivFocus){
      this.retrieveFocusInfo(this.props.blockDivFocus)
    }
  }
  componentWillReceiveProps(newProps){
    this.setItemFocus(newProps.transcriptionid)
    if (!newProps.blockDivFocus){
      this.setState({focus: ""});
    }
    else if (newProps.blockDivFocus !== this.props.blockDivFocus){
      this.retrieveFocusInfo(newProps.blockDivFocus)
    }
  }
  componentWillUnmount(){
    this.mount = false
  }
  render(){
    const displayWindows = () => {
      const windows = Object.keys(this.state.windows).map((key) => {
        if (this.state.windows[key].open){
          return (<Window
              key={key}
              handleClose={this.handleClose}
              handleMinimize={this.handleMinimize}
              handleMaximize={this.handleMaximize}
              handleMiddlize={this.handleMiddlize}
              handleTabChange={this.handleTabChange}
              handleBlockFocusChange={this.setFocus}
              handleSurfaceFocusChange={this.handleSurfaceFocusChange}
              handleSwitchWindow={this.handleSwitchWindow}
              handleDuplicateWindow={this.handleDuplicateWindow}
              resourceid={this.state.focus ? this.state.focus.resourceid : this.props.resourceid}
              windowType={this.state.windows[key].position}
              windowId={this.state.windows[key].windowId}
              windowLoad={this.state.windows[key].windowLoad}
              openWidthHeight={this.state.windows[key].openWidthHeight}
              surfaceid={this.state.surfaceid}
              info={this.state.focus}
              itemFocus={this.state.itemFocus}
              topLevel={this.state.itemFocus.topLevel}
              altWindowState={this.state.windows[key].windowId === "window1" ? this.state.windows["window2"].open : this.state.windows["window1"].open}
              />
            )
          }
          else{
            return null
          }
        })
        return windows
      }
    const textClass = () => {
      let aSideWindowOpen = false;
      if (this.state.windows.window1.open && this.state.windows.window1.position === "sideWindow" && this.state.windows.window1.openWidthHeight === "middle"){
        aSideWindowOpen = true
      }
      else if (this.state.windows.window2.open && this.state.windows.window2.position === "sideWindow"){
        aSideWindowOpen = true
      }
      return aSideWindowOpen
    }

    return (
      <div>
        {this.state.itemFocus &&
          <VersionChain itemInfo={this.state.itemFocus}/>
        }
        <Container className={textClass() ? "lbp-text skinnyText" : "lbp-text fullText"}>
          {this.state.itemFocus &&
          <Text
            doc={this.state.itemFocus.doc}
            topLevel={this.state.itemFocus.topLevel}
            setFocus={this.setFocus}
            handleSurfaceFocusChange={this.handleSurfaceFocusChange}
            openWindow={this.openWindow}
            scrollTo={this.state.focus ? this.state.focus.resourceid.split("/resource/")[1] : this.state.itemFocus.expression.split("/resource/")[1]}
            />
          }
        </Container>
        <TextNavBar
          next={this.state.itemFocus && this.state.itemFocus.next}
          previous={this.state.itemFocus && this.state.itemFocus.previous}
          topLevel={this.state.itemFocus && this.state.itemFocus.topLevel}
          handleClose={this.handleClose}
        />
        <div>
        {
        // <TextNavBar
        // next={this.state.items[this.state.itemFocus] && this.state.items[this.state.itemFocus].next}
        // previous={this.state.items[this.state.itemFocus] && this.state.items[this.state.itemFocus].previous}
        // topLevel={this.state.items[this.state.itemFocus] && this.state.items[this.state.itemFocus].topLevel}
        // handleClose={this.handleClose}
        // />
        }
        {displayWindows()}
        </div>
      </div>
    );
  }
}
export default TextWrapper;
