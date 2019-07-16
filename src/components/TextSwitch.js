import React from 'react';
import Qs from "query-string"
import TextWrapper from "./TextWrapper"
import Collection from "./Collection"
import AuthorCollection from "./AuthorCollection"
import Codex from "./Codex"
import TextOutlineWrapper from "./TextOutlineWrapper"

import {runQuery} from './utils'
import {getItemTranscription, getItemTranscriptionFromBlockDiv, getStructureType} from './Queries'

class TextSwitch extends React.Component {
  constructor(props){
    super(props)
    this.handleUpdateUrlResource = this.handleUpdateUrlResource.bind(this)
    this.state = {
      displayType: "",
      resourceid: "",
      itemTranscriptionId: "",
      blockDivFocus: "",
      resourceTitle: ""
    }
  }
  handleUpdateUrlResource(fullid){
    this.props.history.push({search: '?resourceid=' + fullid})
  }
  getInfo(resourceid){
    const structureTypePromise = runQuery(getStructureType(resourceid))
    structureTypePromise.then((t) => {
      const type = t.data.results.bindings[0].type.value
      const structureType = t.data.results.bindings[0].structureType ? t.data.results.bindings[0].structureType.value : null
      //const level = t.data.results.bindings[0].level ? t.data.results.bindings[0].level.value : null
      const topLevel = t.data.results.bindings[0].topLevel ? t.data.results.bindings[0].topLevel.value : resourceid
      const itemParent = t.data.results.bindings[0].itemParent ? t.data.results.bindings[0].itemParent.value : null
      const resourceTitle = t.data.results.bindings[0].resourceTitle ? t.data.results.bindings[0].resourceTitle.value : ""
      //const itemTranscriptionId = t.data.results.bindings[0].ctranscription ? t.data.results.bindings[0].ctranscription.value : null
      if (type === "http://scta.info/resource/person"){
          this.setState({displayType: "person", resourceid: resourceid, structureType: "", topLevel: "", type: type, resourceTitle: resourceTitle})
      }
      else if (type === "http://scta.info/resource/codex"){
          this.setState({displayType: "codex", resourceid: resourceid, structureType: "", topLevel: "", type: type, resourceTitle: resourceTitle})
      }
      else if (type === "http://scta.info/resource/workGroup"){
          this.setState({displayType: "workGroup", resourceid: resourceid, structureType: structureType, topLevel: topLevel, type: type, resourceTitle: resourceTitle})
      }
      else if (structureType === "http://scta.info/resource/structureCollection"){
          this.setState({displayType: "collection", resourceid: resourceid, structureType: structureType, topLevel: topLevel, type: type, resourceTitle: resourceTitle})
      }
      else if (structureType === "http://scta.info/resource/structureItem" ){
        if (type === "http://scta.info/resource/transcription"){
          this.setState({itemTranscriptionId: resourceid, displayType: "item", blockDivFocus: "", resourceTitle: resourceTitle})
        }
        else {
          const structureTypePromise = runQuery(getItemTranscription(resourceid))
          structureTypePromise.then((t) => {
            this.setState({itemTranscriptionId: t.data.results.bindings[0].ctranscription.value, displayType: "item", blockDivFocus: "", resourceTitle: resourceTitle})
          });
        }
      }
      else if (structureType === "http://scta.info/resource/structureBlock" || structureType === "http://scta.info/resource/structureDivision" ){
        const structureTypePromise = runQuery(getItemTranscriptionFromBlockDiv(resourceid))
        structureTypePromise.then((t) => {
          if (type === "http://scta.info/resource/transcription"){
            this.setState({itemTranscriptionId: itemParent, blockDivFocus: t.data.results.bindings[0].blockDivExpression.value, displayType: "item", resourceTitle: resourceTitle})
          }
          else if (type === "http://scta.info/resource/expression"){
            this.setState({itemTranscriptionId: t.data.results.bindings[0].ctranscription.value, blockDivFocus: resourceid, displayType: "item", resourceTitle: resourceTitle})
          }
          else {
            this.setState({itemTranscriptionId: t.data.results.bindings[0].ctranscription.value, blockDivFocus: t.data.results.bindings[0].blockDivExpression.value, displayType: "item", resourceTitle: resourceTitle})
          }
        });
      }
    });
  }

  componentDidMount(){
    const newResourceId = Qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).resourceid
    this.getInfo(newResourceId)
  }
  componentWillReceiveProps(nextProps) {
    const newResourceId = Qs.parse(nextProps.location.search, { ignoreQueryPrefix: true }).resourceid
    this.getInfo(newResourceId)
  }



  render(){
    const display = () => {
      if (this.state.displayType === "person"){
        return (<AuthorCollection resourceid={this.state.resourceid}/>)

      }
      else if (this.state.displayType === "workGroup"){
        return (
          <Collection resourceid={this.state.resourceid} structureType={this.state.structureType} topLevel={this.state.topLevel} type={this.state.type}/>
        )
      }
      else if (this.state.displayType === "collection"){
        return (
          <TextOutlineWrapper
          focusResourceid={this.state.resourceid}
          resourceid={this.state.resourceid}
          title={this.state.resourceTitle}
          hidden={false}
          mtFocus={""}
          collectionLink={true}/>
        )


      }
      else if (this.state.displayType === "item"){
        return (<TextWrapper itemid={this.state.resourceid} transcriptionid={this.state.itemTranscriptionId} blockDivFocus={this.state.blockDivFocus} handleUpdateUrlResource={this.handleUpdateUrlResource}/>)
      }
      else if (this.state.displayType === "codex"){
        return (<Codex codexid={this.state.resourceid}/>)
      }
      else{
        return null
      }
    }
  return (
    display()
    );
  }

}

export default TextSwitch;
