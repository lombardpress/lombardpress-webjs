import React from 'react';
import Qs from "query-string";
import {Helmet} from "react-helmet";
import TextWrapper from "./TextWrapper"
import TextArticle from "./TextArticle"
import Collection from "./Collection"

import Codex from "./Codex"
import ExpressionType from './ExpressionType';
import ResourceTypeList from './ResourceTypeList';

import {runQuery} from './utils'
import {getArticleTranscriptionDoc, getItemTranscriptionFromBlockDiv, getStructureType} from './Queries'

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
      author: "",
      authorTitle: "",
      tokenRange: ""

    }
  }
  handleUpdateUrlResource(fullid){
    this.props.history.push({search: '?resourceid=' + fullid})
  }
  getInfo(resourceid){
    let tokenRange;
    if (resourceid.split("@")[1]){
      tokenRange = {start: parseInt(resourceid.split("@")[1].split("-")[0]), end: parseInt(resourceid.split("@")[1].split("-")[1])}
    }
    resourceid = resourceid.split("@")[0]

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
      const authorTitle = bindings.authorTitle ? bindings.authorTitle.value : ""
      const ctranscription = bindings.ctranscription ? bindings.ctranscription.value : ""

      //const itemTranscriptionId = t.data.results.bindings[0].ctranscription ? t.data.results.bindings[0].ctranscription.value : null
      if (resourceid === "http://scta.info/resource/person"){
        this.setState({displayType: "personList", resourceid: resourceid, structureType: "", topLevel: "", type: "", resourceTitle: ""})
      }
      else if (resourceid === "http://scta.info/resource/codex"){
        this.setState({displayType: "codexList", resourceid: resourceid, structureType: "", topLevel: "", type: "", resourceTitle: ""})
      }
      else if (resourceid === "http://scta.info/resource/expressionType"){
        this.setState({displayType: "expressionTypeList", resourceid: resourceid, structureType: "", topLevel: "", type: "", resourceTitle: ""})
      }
      else if (type === "http://scta.info/resource/expressionType"){
        this.setState({displayType: "expressionType", resourceid: resourceid, structureType: "", topLevel: "", type: "", resourceTitle: ""})
      }
      else if (type === "http://scta.info/resource/person"){
        this.setState({displayType: "person", resourceid: resourceid, structureType: "", topLevel: "", type: type, resourceTitle: resourceTitle})
      }
      else if (type === "http://scta.info/resource/article"){
        const structureTypePromise = runQuery(getArticleTranscriptionDoc(resourceid))
        structureTypePromise.then((t) => {
          this.setState(
            {displayType: "article",
            articleDoc: t.data.results.bindings[0] ? t.data.results.bindings[0].doc.value : "", // conditional checks in case the query comes up empty; if empty it sets transcription id to ""
            articleType: t.data.results.bindings[0] ? t.data.results.bindings[0].articleType.value : "", // conditional checks in case the query comes up empty; if empty it sets transcription id to ""
            resourceid: resourceid,
            structureType: "", topLevel: "",
            type: type,
            resourceTitle: resourceTitle}
          )
        })

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
          this.setState({
            displayType: "collection", 
            transcriptionid: ctranscription,
            resourceid: resourceid, 
            //TODO: this is a hacky way to get expression id; it should be retrievable from the query itself
            expressionid: "http://scta.info/resource/" + resourceid.split("/resource/")[1].split("/")[0],
            structureType: structureType, 
            topLevel: topLevel, 
            type: type, 
            resourceTitle: resourceTitle, 
            author: author, 
            authorTitle: authorTitle
          }
          )
      }
      else if (structureType === "http://scta.info/resource/structureItem" ){
       // if (type === "http://scta.info/resource/transcription"){
          this.setState({
            itemTranscriptionId: ctranscription,
            displayType: "item", 
            resourceid: resourceid, // focused resource introduced via url parameter
            //TODO: this is a hacky way to get expression id; it should be retrievable from the query itself
            expressionid: "http://scta.info/resource/" + resourceid.split("/resource/")[1].split("/")[0],
            transcriptionid: ctranscription,
            resourceTitle: resourceTitle, 
            tokenRange: tokenRange,
          })
        }
      else if (structureType === "http://scta.info/resource/structureElement" || structureType === "http://scta.info/resource/structureBlock" || structureType === "http://scta.info/resource/structureDivision" ){
        const structureTypePromise = runQuery(getItemTranscriptionFromBlockDiv(resourceid))
        structureTypePromise.then((t) => {
          // if transcription
          if (type === "http://scta.info/resource/transcription"){
            this.setState({
              itemTranscriptionId: itemParent, 
              resourceid: resourceid, // focused resource introduced via url parameter
              expressionid: t.data.results.bindings[0].blockDivExpression.value,
              transcriptionid: resourceid,
              displayType: "item", 
              resourceTitle: resourceTitle, 
              tokenRange: tokenRange
            })
          }
          // if expression
          else if (type === "http://scta.info/resource/expression"){
            if (t.data.results.bindings[0].ctranscription){
              this.setState({
                itemTranscriptionId: t.data.results.bindings[0].ctranscription.value, 
                resourceid: resourceid, // focused resource introduced via url parameter
                expressionid: resourceid,
                transcriptionid: "this would be the focus transcription id",
                displayType: "item", 
                resourceTitle: resourceTitle, 
                tokenRange: tokenRange})
            }
            else{
              this.setState({displayType: "notFound"})
            }
          }
          // if manifestation
          else {
            this.setState(
              {itemTranscriptionId: t.data.results.bindings[0].ctranscription.value, 
              resourceid: resourceid, // focused resource introduced via url parameter
              expressionid: t.data.results.bindings[0].blockDivExpression.value,
              transcriptionid: "this would be the focus transcription id",
              displayType: "item", 
              resourceTitle: resourceTitle, 
              tokenRange: tokenRange})
          }
        });
      }
      else{
        this.setState({displayType: "notFound"})
      }
    });
  }

  componentDidMount(){
    // conditional to only get info when props.location exists
    if (this.props.location){
      const newResourceId = Qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).resourceid
      if (newResourceId.includes("https://scta.info/")){
        this.handleUpdateUrlResource(newResourceId.replace("https://scta.info/", "http://scta.info/"))
      }
      else{
        this.getInfo(newResourceId)
      }
    }
  }
  
  componentDidUpdate(prevProps) {
    const newResourceId = Qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).resourceid
    const oldResourceId = Qs.parse(prevProps.location.search, { ignoreQueryPrefix: true }).resourceid
    if (newResourceId !== oldResourceId){
      if (newResourceId.includes("https://scta.info/")){
        this.handleUpdateUrlResource(newResourceId.replace("https://scta.info/", "http://scta.info/"))
      }
      else{
        this.getInfo(newResourceId)
      }
    }
  }



  render(){
    const display = () => {
      if (this.state.displayType === "personList"){
        return (<ResourceTypeList resourceTypeId="http://scta.info/resource/person"/>)
      }
      else if (this.state.displayType === "codexList"){
        return (<ResourceTypeList resourceTypeId="http://scta.info/resource/codex"/>)
      }
      else if (this.state.displayType === "expressionTypeList"){
        return (<ResourceTypeList resourceTypeId="http://scta.info/resource/expressionType"/>)
      }
      else if (this.state.displayType === "person"){
        return (
        // <AuthorCollection resourceid={this.state.resourceid}/>
        <TextWrapper 
          resourceid={this.state.resourceid}
          resourceType="person"
          handleUpdateUrlResource={this.handleUpdateUrlResource}
          />
        )

      }
      else if (this.state.displayType === "article"){
        return (<TextArticle doc={this.state.articleDoc} articleType={this.state.articleType}/>)

      }
      else if (this.state.displayType === "workGroup"){
        //TODO: this conditional should be comined with the conditional below
        return (
          // <Collection resourceid={this.state.resourceid} structureType={this.state.structureType} topLevel={this.state.topLevel} type={this.state.type}/>
        <TextWrapper 
        resourceid={this.state.resourceid}
        resourceType="workGroup"
        handleUpdateUrlResource={this.handleUpdateUrlResource}
        />
      )
      }
      else if (this.state.displayType === "collection"){
        return (
          <TextWrapper 
          resourceid={this.state.resourceid}
          expressionid={this.state.expressionid}
          transcriptionid={this.state.transcriptionid}
          resourceType="collection"
          handleUpdateUrlResource={this.handleUpdateUrlResource}
          />
          )
      }
      else if (this.state.displayType === "item"){
        // check to see if a transcription for this text has been found
        if (this.state.itemTranscriptionId){
          return (
            <TextWrapper 
            resourceid={this.state.resourceid}
            expressionid={this.state.expressionid}
            transcriptionid={this.state.transcriptionid}
            tokenRange={this.state.tokenRange}
            itemTranscriptionId={this.state.itemTranscriptionId}
            handleUpdateUrlResource={this.handleUpdateUrlResource}
            />
          )
        }
        // if no transcription resource id, exists return message
        else{
          return (<p>Apologies, no transcriptions of this text are currently available.</p>)


        }
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
      else if (this.state.displayType === "expressionType"){
        return (<ExpressionType expressionTypeId={this.state.resourceid}/>)
      }
      else if (this.state.displayType === "notFound"){
        return (<p>Apologies, this resource could not be found</p>)
      }
      else{
        return null
      }
    }
  const dctype = () => {
    if (this.state.displayType === "codex"){
      return <meta name="BIB.type" content="Manuscript"/>
    }
    else{
      return <meta name="DC.type" content="document"/>
    }
  }
  return (
    <div>
      <Helmet>
        <title>{this.state.resourceTitle}</title>
        <link rel="schema.DC" href="http://purl.org/dc/elements/1.1/" ></link>
        <link rel="schema.DCTERMS" href="http://purl.org/dc/terms/"/>
        <link rel="schema.BIB" href="http://purl.org/net/biblio#"/>
        {dctype()}
        <meta name="DC.identifier" content={this.state.resourceid}/>
        {//<meta name="DC.description" content="test description"/>
        }
        <meta name="DC.title" content={this.state.resourceTitle}/>
        <meta name="DC.creator" content={this.state.authorTitle}/>
        <meta name="DC.Language" content="la"/>
        <meta name="DC.Publisher" content="SCTA"/>
        
      </Helmet>
      {display()}
    </div>
    
    );
  }

}

export default TextSwitch;
