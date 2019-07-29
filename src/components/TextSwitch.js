import React from 'react';
import Qs from "query-string"
import TextWrapper from "./TextWrapper"
import Collection from "./Collection"
import AuthorCollection from "./AuthorCollection"
import Codex from "./Codex"
import TextOutlineWrapper from "./TextOutlineWrapper"
import Container from 'react-bootstrap/Container';

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
      resourceTitle: "",
      author: ""
    }
  }
  handleUpdateUrlResource(fullid){
    this.props.history.push({search: '?resourceid=' + fullid})
  }
  getInfo(resourceid){
    const structureTypePromise = runQuery(getStructureType(resourceid))
    structureTypePromise.then((t) => {
      // reduce results to bindings variable
      const bindings = t.data.results.bindings.length > 0 ? t.data.results.bindings[0] : ""
      // get specific results from bindings data
      const type = bindings.type ? bindings.type.value : null
      const structureType = bindings.structureType ? bindings.structureType.value : null
      //const level = bindings.level ? bindings.level.value : null
      const topLevel = bindings.topLevel ? bindings.topLevel.value : resourceid
      const itemParent = bindings.itemParent ? bindings.itemParent.value : null
      const resourceTitle = bindings.resourceTitle ? bindings.resourceTitle.value : ""
      const author = bindings.author ? bindings.author.value : ""

      //const itemTranscriptionId = t.data.results.bindings[0].ctranscription ? t.data.results.bindings[0].ctranscription.value : null
      if (type === "http://scta.info/resource/person"){
          this.setState({displayType: "person", resourceid: resourceid, structureType: "", topLevel: "", type: type, resourceTitle: resourceTitle})
      }
      else if (type === "http://scta.info/resource/codex"){
          this.setState({displayType: "codex", resourceid: resourceid, structureType: "", topLevel: "", type: type, resourceTitle: resourceTitle})
      }
      else if (type === "http://scta.info/resource/surface"){
          this.setState({displayType: "surface", resourceid: resourceid, structureType: "", topLevel: "", type: type, resourceTitle: resourceTitle})
      }
      else if (type === "http://iiif.io/api/presentation/2#Manifest"){
          this.setState({displayType: "manifest", resourceid: resourceid, structureType: "", topLevel: "", type: type, resourceTitle: resourceTitle})
      }
      else if (type === "http://iiif.io/api/presentation/2#Canvas"){
          this.setState({displayType: "canvas", resourceid: resourceid, structureType: "", topLevel: "", type: type, resourceTitle: resourceTitle})
      }
      else if (type === "http://scta.info/resource/workGroup"){
          this.setState({displayType: "workGroup", resourceid: resourceid, structureType: structureType, topLevel: topLevel, type: type, resourceTitle: resourceTitle})
      }
      else if (structureType === "http://scta.info/resource/structureCollection"){
          this.setState({displayType: "collection", resourceid: resourceid, structureType: structureType, topLevel: topLevel, type: type, resourceTitle: resourceTitle, author: author})
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
            if (t.data.results.bindings[0].ctranscription){
              this.setState({itemTranscriptionId: t.data.results.bindings[0].ctranscription.value, blockDivFocus: resourceid, displayType: "item", resourceTitle: resourceTitle})
            }
            else{
              this.setState({displayType: "notFound"})
            }
          }
          else {
            this.setState({itemTranscriptionId: t.data.results.bindings[0].ctranscription.value, blockDivFocus: t.data.results.bindings[0].blockDivExpression.value, displayType: "item", resourceTitle: resourceTitle})
          }
        });
      }
      else{
        this.setState({displayType: "notFound"})
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
          <Container className="textOutlineContainer">
            <TextOutlineWrapper
              focusResourceid={this.state.resourceid}
              resourceid={this.state.resourceid}
              title={this.state.resourceTitle}
              hidden={false}
              mtFocus={""}
              collectionLink={true}/>
          </Container>
        )


      }
      else if (this.state.displayType === "item"){
        //TODO: item id is shortItemId pull from transcription id.
        // it would be better to be getting this from query rather than string deconstruction
        return (<TextWrapper itemid={this.state.itemTranscriptionId.split("/resource/")[1].split("/")[0]} transcriptionid={this.state.itemTranscriptionId} blockDivFocus={this.state.blockDivFocus} handleUpdateUrlResource={this.handleUpdateUrlResource}/>)
      }
      else if (this.state.displayType === "codex"){
        return (<Codex codexid={this.state.resourceid}/>)
      }
      else if (this.state.displayType === "surface"){
        return (<Codex surfaceid={this.state.resourceid}/>)
      }
      else if (this.state.displayType === "canvas"){
        return (<Codex canvasid={this.state.resourceid}/>)
      }
      else if (this.state.displayType === "manifest"){
        return (<Codex manifestid={this.state.resourceid}/>)
      }
      else if (this.state.displayType === "notFound"){
        return (<p>Apologies, this resource could not be found</p>)
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
