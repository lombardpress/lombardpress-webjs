import React from 'react';
import Qs from "query-string"

import Container from 'react-bootstrap/Container';

import Window from "./Window"
import TextNavBar from "./TextNavBar"
import Text from "./Text"
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
    this.handleSwitchWindow = this.handleSwitchWindow.bind(this)
    this.handleSurfaceFocusChange = this.handleSurfaceFocusChange.bind(this)
    this.state = {
      doc: "",
      focus: "",
      focusRelatedExpressions: "",
      itemFocus: "",
      surfaceid: "",
      windows: {
        window1: {
          windowId: "window1",
          open: false,
          windowLoad: "info",
          position: "sideWindow"
        },
        window2: {
          windowId: "window2",
          open: false,
          windowLoad: "info",
          position: "bottomWindow"
        }
      }
    }
  }
  openWindow(id, windowLoad){
    console.log("test", id)
    this.setState((prevState) => {
      const windows = prevState.windows
      windows[id].open = true
      windows[id].windowLoad = windowLoad
      return {
        windows: windows,
      }
    })
  }
  handleClose(windowId){
    this.setState((prevState) => {
      const windows = prevState.windows
      windows[windowId].open = !windows[windowId].open
      return {windows: windows}

    })
    //scroll is supposed to re-align text scroll to focused paragraph after side bar close.
    //but it is not quite working
    scrollToParagraph(this.state.blockFocus, true)

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
    const shortid = id.includes("http") ? id.split("/resource/")[1] : id
    // get info
    const info = runQuery(basicInfoQuery(fullid))
    //arrange info and set it to state
    this.arrangeFocusInfo(info, fullid)
    // get related expressions info
    const relatedExpressions = runQuery(getRelatedExpressions(fullid))
    //arrange info and set it to state
    this.arrangeFocusRelatedInfo(relatedExpressions)

    scrollToParagraph(shortid, true)

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
              manifestations: manifestations
            }
          });
        }
      });
    }
    arrangeFocusRelatedInfo(relatedInfo){
        relatedInfo.then((d) => {
          console.log("new data", d)
          const bindings = d.data.results.bindings
          const relatedExpressions = bindings.map((r) => {
              return {
                resourceid: r.isRelatedTo.value,
                relationLabel: r.label.value
              }
            });
        if (this.mount){
          this.setState({
            focusRelatedExpressions: relatedExpressions
          });
          }
        });
      }
    setItemFocus(id){
      const fullid = id.includes("http") ? id : "http://scta.info/resource/" + id
      const shortid = id.includes("http") ? id.split("/resource/")[1] : id
      // get info
      const info = runQuery(itemTranscriptionInfoQuery(fullid))
      this.arrangeItemFocusInfo(info)
    }
    arrangeItemFocusInfo(itemFocusInfo){
        itemFocusInfo.then((d) => {
          const bindings = d.data.results.bindings[0]
          console.log("title", bindings.title)
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
                topLevel: bindings.topLevelExpression.value
              }
            });
          }
        });
      }

  componentDidMount(){
    this.mount = true
    this.setItemFocus(this.props.transcriptionid)
    if (this.props.blockDivFocus){
      console.log("block div focus", this.props.blockDivFocus)
      this.setFocus(this.props.blockDivFocus)
    }
  }
  componentWillReceiveProps(newProps){
    this.setItemFocus(newProps.transcriptionid)
    if (newProps.blockDivFocus){
      this.setFocus(newProps.blockDivFocus)
    }
  }
  componentWillUnmount(){
    this.mount = false
  }
  render(){
    const displayWindows = () => {
      const windows = Object.keys(this.state.windows).map((key) => {
        if (this.state.windows[key].open && ((this.state.focus && this.state.focusRelatedExpressions) || this.state.surfaceid)){
          return (<Window windowLoad={this.state.windows[key].windowLoad}
              key={key}
              handleClose={this.handleClose}
              handleTabChange={this.handleTabChange}
              handleBlockFocusChange={this.setFocus}
              handleSurfaceFocusChange={this.handleSurfaceFocusChange}
              handleSwitchWindow={this.handleSwitchWindow}
              resourceid={this.state.focus.resourceid}
              windowType={this.state.windows[key].position}
              windowId={this.state.windows[key].windowId}
              windowLoad={this.state.windows[key].windowLoad}
              surfaceid={this.state.surfaceid}
              info={this.state.focus}
              relatedExpressions={this.state.focusRelatedExpressions}
              topLevel={this.state.itemFocus.topLevel}
              />
            )
          }
        })
        return windows
      }
    const textClass = () => {
      let aSideWindowOpen = false;
      if (this.state.windows.window1.open && this.state.windows.window1.position === "sideWindow"){
        aSideWindowOpen = true
      }
      else if (this.state.windows.window2.open && this.state.windows.window2.position === "sideWindow"){
        aSideWindowOpen = true
      }
      return aSideWindowOpen
    }

    return (
      <div>
        <Container className={textClass() ? "lbp-text skinnyText" : "lbp-text fullText"}>
          {this.state.itemFocus &&
          <Text
            doc={this.state.itemFocus.doc}
            topLevel={this.state.itemFocus.topLevel}
            setFocus={this.setFocus}
            handleSurfaceFocusChange={this.handleSurfaceFocusChange}
            openWindow={this.openWindow}
            scrollTo={this.state.focus ? this.state.focus.resourceid.split("/resource/")[1] : null}
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
