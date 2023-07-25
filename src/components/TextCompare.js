import React from 'react';
import {Link} from 'react-router-dom';
import { FaEyeSlash, FaEye, FaTable } from 'react-icons/fa';

import {runQuery} from './utils'
import {basicInfoQuery} from './Queries'
import TextCompareItem from './TextCompareItem'

class TextCompare extends React.Component {
  constructor(props){
    super(props)
    this.handleToggleShowAll = this.handleToggleShowAll.bind(this)
    this.handleToggleShowAllImages = this.handleToggleShowAllImages.bind(this)
    this.mounted = ""
    this.state = {
      info: "",
      show: false,
      showImages: false,
      baseText: ""
    }
  }

  handleToggleShowAll(){
    this.setState((prevState) => {
      return{
        show: !prevState.show
      }
    })
  }
  handleToggleShowAllImages(){
    this.setState((prevState) => {
      return{
        showImages: !prevState.showImages
      }
    })
  }

  // TODO dupblicate of function in Text Component
  // needs refactoring
  arrangeTextInfo(info, resourceid){
    info.then((d) => {
      const bindings = d.data.results.bindings[0]
      const manifestations = d.data.results.bindings.map((b) => {
        return {
          manifestation: b.manifestation.value,
          manifestationTitle: b.manifestationTitle.value,
          transcription: b.manifestationCTranscription ? b.manifestationCTranscription.value : "",
          transcriptionDoc: b.manifestationCTranscriptionDoc?.value
        }
      })
      if (this.mounted === true && bindings){
        this.setState({
          info: {
            resourceid: resourceid,
            title: bindings.title.value,
            structureType: bindings.structureType.value,
            inbox: bindings.inbox.value,
            next: bindings.next ? bindings.next.value : "",
            previous: bindings.previous ? bindings.previous.value : "",
            cdoc: bindings.cdoc ? bindings.cdoc.value : "",
            cxml: bindings.cxml ? bindings.cxml.value : "",
            topLevel: bindings.topLevelExpression.value,
            cmanifestation: bindings.cmanifestation ? bindings.cmanifestation.value : "",
            ctranscription: bindings.ctranscription ? bindings.ctranscription.value : "",
            manifestations: manifestations
          }
        });
      }
    });
  }
  getTextInfo(id){
    const info = runQuery(basicInfoQuery(id))
    this.arrangeTextInfo(info, id)
  }
  componentDidMount(){
    this.mounted = true;
    //TODO: setting "derivative state" here is an anti-pattern
    //instead this should probably be controlled by parent 
    //(handleToggleShowAll should probably change parent which would then pass down the required prop rather than setting prop to state)
    this.setState({show: this.props.show})
    this.setState({showImages: this.props.showImages})
    //NOTE: this conditional, does set prop to state, but there is a reason. 
    // the point is that the information has already been achieved, thus we save one async call by using props. 
    // otherwise an async request is called.
    // I think the "derivate state is acceptable in this case"
    if (this.props.isMainText){
      this.setState({info: this.props.info})
    }
    else{
      this.getTextInfo(this.props.expressionid)
    }
  }
  componentDidUpdate(prevProps){
    // conditional try to restrict new async calls to only when props.info changes
    if ((this.props.info.resourceid !== prevProps.info.resourceid) || (this.props.info.relatedExpressions !== prevProps.info.relatedExpressions)){
      if (this.props.isMainText){
        this.setState({info: this.props.info})
      }
      else{
        this.getTextInfo(this.props.expressionid)
      }
    }
    //NOTE: setting state from props here is an anti pattern; 
    //view either needs to be controlled by props or state, but not both
    if (this.props.show !== prevProps.show){
      this.handleToggleShowAll()
    }
    //NOTE: setting state from props here is an anti pattern
    //view either needs to be controlled by props or state, but not both
    if (this.props.showImages !== prevProps.showImages){
      this.handleToggleShowAllImages()
    }
  }
  componentWillUnmount(){
    this.mounted = false;
  }
  render(){
    const displayComparisons = () => {
      // NOTE: this conditional here to stop attempt to display text manifestation texts at the collection level
      // collection level is usually just too big to be useful. 
      if (this.props.isMainText && this.props.info.structureType === "http://scta.info/resource/structureCollection"){
        return <p>Text too big to display; move down the text hierarchy to focus on a smaller section</p>
      }
      else if (this.state.info.manifestations){
        const texts = this.state.info.manifestations.map((m) => {
          return (
            <TextCompareItem
            key={m.transcription}
            base={this.props.baseText}
            compareTranscription={m.transcription}
            compareTranscriptionDoc={m.transcriptionDoc}
            manifestationTitle={m.manifestationTitle}
            manifestation={m.manifestation}
            handleChangeBase={this.props.handleChangeBase}
            show={this.state.show}
            showCompare={this.props.isMainText ? true : true}
            showCompareType={this.props.isMainText ? 'editDistance' : 'ngram'}
            surfaceWidth={this.props.surfaceWidth}
            isRelatedToRange={this.props.isRelatedToRange}
            targetRange={this.props.targetRange}
            isMainText={this.props.isMainText}
            relationLabel={this.props.relationLabel}
            showImages={this.state.showImages}
            />
          )
        })
        return texts
      }
    }
  return (
    <div style={{"borderBottom": "1px solid rgba(0, 0, 0, 0.1)", padding: "5px"}}>
      {
        // the link to reroute is not quite working, because the base Text is not resetting, focusBlockChange might be better; but item structure will also need to be changed.
      }
      
      <div style={{fontSize: "12px"}}>
        {this.props.isMainText && <span>[Target] </span>}
        <span>{this.props.relationLabel}</span> 
        {(this.props.referringResource && this.props.referringResource !== this.props.info.resourceid) 
        && <span> (<Link to={"/text?resourceid=" + this.props.referringResource}>via</Link>)</span>}
      </div>
      <div>
        {this.state.info.resourceid ?
        <Link to={"/text?resourceid=" + this.state.info.resourceid + ((this.props.relationLabel !== "isQuotedBy" && this.props.relationLabel !== "isReferencedBy" && this.props.isRelatedToRange) ? "@" + this.props.isRelatedToRange : "")}>
          {this.props.authorTitle || this.props.longTitle ? <span> {this.props.authorTitle} {this.props.longTitle}</span> : this.state.info.resourceid}
        </Link> :
        this.props.authorTitle || this.props.longTitle ? <span> {this.props.authorTitle} {this.props.longTitle}</span> : this.state.info.resourceid
        }
        <span> | </span>
        {this.state.info.resourceid && <span className="lbp-span-link" onClick={() => this.handleToggleShowAll()}>{this.state.show ? <FaEyeSlash/> : <FaEye/>}</span>}
        <span> | </span>
        {this.props.expressionid && <span className="lbp-span-link" title="add to collation table" onClick={this.props.isMainText ? this.props.handleShowCollationOverlay : () => 
        { 
          // this conditional checks checks if there is a wordRange and the target is active; if true then it adds the wordRange
          // otherwise no WordRange is added
          const fullEid = ((this.props.relationLabel !== "isQuotedBy" && this.props.relationLabel !== "isReferencedBy") && this.props.isRelatedToRange) ? this.props.expressionid + "@" + this.props.isRelatedToRange : this.props.expressionid
          this.props.handleAddCtRelatedExpressions(fullEid)}}><FaTable/></span>
        }
        <span> | </span>
        <a href={"https://mirador.scta.info?blockid=" + this.state.info.resourceid} target="_blank" rel="noopener noreferrer"><img alt="view in mirador" style={{width: "12px", height: "12px"}} src="https://projectmirador.org/img/mirador-logo.svg"></img></a>
      </div>
      <div className={this.state.show ? "unhidden" : "hidden"} style={{"paddingLeft": "10px"}}>
        {displayComparisons()}
      </div>
    </div>
    );
  }
}
export default TextCompare;
