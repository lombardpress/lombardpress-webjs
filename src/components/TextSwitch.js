import React from 'react';
import Qs from "query-string"
import TextWrapper from "./TextWrapper"

import {runQuery} from './utils'
import {getItemTranscription, getItemTranscriptionFromBlockDiv, getStructureType} from './Queries'

class TextSwitch extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      displayType: "",
      resourceInfo: "",
      itemTranscriptionId: "",
      blockDivFocus: ""
    }
  }
  getInfo(resourceid){
    const structureTypePromise = runQuery(getStructureType(resourceid))
    structureTypePromise.then((t) => {
      console.log("t", t)
      const type = t.data.results.bindings[0].type.value
      const structureType = t.data.results.bindings[0].structureType ? t.data.results.bindings[0].structureType.value : null
      const level = t.data.results.bindings[0].level ? t.data.results.bindings[0].level.value : null
      const topLevel = t.data.results.bindings[0].topLevel ? t.data.results.bindings[0].topLevel.value : resourceid
      const itemParent = t.data.results.bindings[0].itemParent ? t.data.results.bindings[0].itemParent.value : null
      const itemTranscriptionId = t.data.results.bindings[0].ctranscription ? t.data.results.bindings[0].ctranscription.value : null
      console.log(t)
      if (type === "http://scta.info/resource/workGroup"){
          this.setState({displayType: "workGroup", resourceInfo: t})
      }
      else if (structureType === "http://scta.info/resource/structureCollection"){
          this.setState({displayType: "collection", resourceInfo: t})
      }
      else if (structureType === "http://scta.info/resource/structureItem" ){
        if (type === "http://scta.info/resource/transcription"){
          this.setState({itemTranscriptionId: resourceid})
        }
        else {
          const structureTypePromise = runQuery(getItemTranscription(resourceid))
          structureTypePromise.then((t) => {
            console.log("t", t)
            this.setState({itemTranscriptionId: t.data.results.bindings[0].ctranscription.value})
          });
        }
      }
      else if (structureType === "http://scta.info/resource/structureBlock" || structureType === "http://scta.info/resource/structureDivision" ){
        const structureTypePromise = runQuery(getItemTranscriptionFromBlockDiv(resourceid))
        structureTypePromise.then((t) => {
          if (type === "http://scta.info/resource/transcription"){
            this.setState({itemTranscriptionId: itemParent, blockDivFocus: t.data.results.bindings[0].blockDivExpression.value})
          }
          else if (type === "http://scta.info/resource/expression"){
            this.setState({itemTranscriptionId: t.data.results.bindings[0].ctranscription.value, blockDivFocus: resourceid})
          }
          else {
            this.setState({itemTranscriptionId: t.data.results.bindings[0].ctranscription.value, blockDivFocus: t.data.results.bindings[0].blockDivExpression.value})
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
  return (
    <div>
      {this.state.itemTranscriptionId && <TextWrapper transcriptionid={this.state.itemTranscriptionId} blockDivFocus={this.state.blockDivFocus}/>}
    </div>
  );
  }
}

export default TextSwitch;
