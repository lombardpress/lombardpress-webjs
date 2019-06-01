import React from 'react';
import Surface from "./Surface"
import Surface2 from "./Surface2"
import XmlView from "./XmlView"
import Info from "./Info"
import WindowNavBar from "./WindowNavBar"
import NextPrevBar from "./NextPrevBar"

import {runQuery} from './utils'
import {basicInfoQuery} from './Queries'

class Window extends React.Component {
  constructor(props){
    super(props)
    this.retrieveInfo = this.retrieveInfo.bind(this)
    this.state = {
      windowLoad: "",
      info: {
        resourceid: "",
        title: "",
        manifestations: [],
        inbox: [],
        next: "",
        previous: "",
        doc: ""
      }
    }
  }
  // TODO: if this was moved above into TEXT component, then it wouldn't need to be re-called after navigating away and coming back or switching to different window
  retrieveInfo(resourceid){
    const _this = this;
    const id = resourceid.includes("http") ? resourceid : "http://scta.info/resource/" + resourceid
    const info = runQuery(basicInfoQuery(id))
    info.then((d) => {
      console.log("d", d)
      const bindings = d.data.results.bindings[0]
      console.log("bindings", bindings)
      this.setState({
        info: {
          resourceid: resourceid,
          title: bindings.title.value,
          structureType: bindings.structureType.value,
          inbox: bindings.inbox.value,
          next: bindings.next ? bindings.next.value : "",
          previous: bindings.previous ? bindings.previous.value : "",
          cdoc: bindings.cdoc.value,
          cxml: bindings.cxml.value,
          topLevel: bindings.topLevelExpression.value,
          manifestations: ["test1", "test2"]
        }
      })
    });
  }
  componentDidMount(){
    this.setState({windowLoad: this.props.windowLoad})
    this.retrieveInfo(this.props.resourceid)

  }
  componentWillReceiveProps(newProps){
    this.setState({windowLoad: newProps.windowLoad})
    this.retrieveInfo(newProps.resourceid)

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
        case "xml":
          return <XmlView info={this.state.info}/>
        case "info":
          return <Info info={this.state.info} topLevel={this.props.topLevel}/>
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
      <NextPrevBar info={this.state.info} handleBlockFocusChange={this.props.handleBlockFocusChange}/>

      {displayChild()}
    </div>
    );
  }
}

export default Window;
