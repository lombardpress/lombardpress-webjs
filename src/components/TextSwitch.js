import React from 'react';
import Qs from "query-string"
import TextWrapper from "./TextWrapper"
import Collection from "./Collection"
import AuthorCollection from "./AuthorCollection"

import {runQuery} from './utils'
import {getItemTranscription, getItemTranscriptionFromBlockDiv, getStructureType} from './Queries'

class TextSwitch extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      displayType: "",
      resourceid: "",
      itemTranscriptionId: "",
      blockDivFocus: ""
    }
  }
  getInfo(resourceid){
    const structureTypePromise = runQuery(getStructureType(resourceid))
    structureTypePromise.then((t) => {
      const type = t.data.results.bindings[0].type.value
      const structureType = t.data.results.bindings[0].structureType ? t.data.results.bindings[0].structureType.value : null
      const level = t.data.results.bindings[0].level ? t.data.results.bindings[0].level.value : null
      const topLevel = t.data.results.bindings[0].topLevel ? t.data.results.bindings[0].topLevel.value : resourceid
      const itemParent = t.data.results.bindings[0].itemParent ? t.data.results.bindings[0].itemParent.value : null
      const itemTranscriptionId = t.data.results.bindings[0].ctranscription ? t.data.results.bindings[0].ctranscription.value : null
      if (type === "http://scta.info/resource/person"){
          this.setState({displayType: "person", resourceid: resourceid, structureType: "", topLevel: "", type: type})
      }
      else if (type === "http://scta.info/resource/workGroup"){
          this.setState({displayType: "collection", resourceid: resourceid, structureType: structureType, topLevel: topLevel, type: type})
      }
      else if (structureType === "http://scta.info/resource/structureCollection"){
          this.setState({displayType: "collection", resourceid: resourceid, structureType: structureType, topLevel: topLevel, type: type})
      }
      else if (structureType === "http://scta.info/resource/structureItem" ){
        if (type === "http://scta.info/resource/transcription"){
          this.setState({itemTranscriptionId: resourceid, displayType: "item"})
        }
        else {
          const structureTypePromise = runQuery(getItemTranscription(resourceid))
          structureTypePromise.then((t) => {
            this.setState({itemTranscriptionId: t.data.results.bindings[0].ctranscription.value, displayType: "item"})
          });
        }
      }
      else if (structureType === "http://scta.info/resource/structureBlock" || structureType === "http://scta.info/resource/structureDivision" ){
        const structureTypePromise = runQuery(getItemTranscriptionFromBlockDiv(resourceid))
        structureTypePromise.then((t) => {
          if (type === "http://scta.info/resource/transcription"){
            this.setState({itemTranscriptionId: itemParent, blockDivFocus: t.data.results.bindings[0].blockDivExpression.value, displayType: "item"})
          }
          else if (type === "http://scta.info/resource/expression"){
            this.setState({itemTranscriptionId: t.data.results.bindings[0].ctranscription.value, blockDivFocus: resourceid, displayType: "item"})
          }
          else {
            this.setState({itemTranscriptionId: t.data.results.bindings[0].ctranscription.value, blockDivFocus: t.data.results.bindings[0].blockDivExpression.value, displayType: "item"})
          }
        });
      }
    });
  }

  componentDidMount(){
    const _this = this;
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
      else if (this.state.displayType === "collection"){
        return (<Collection resourceid={this.state.resourceid} structureType={this.state.structureType} topLevel={this.state.topLevel} type={this.state.type}/>)

      }
      else if (this.state.displayType === "item"){
        return (<TextWrapper transcriptionid={this.state.itemTranscriptionId} blockDivFocus={this.state.blockDivFocus}/>)
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
