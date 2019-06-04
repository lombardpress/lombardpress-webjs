import React from 'react';
import Diff from 'diff-match-patch'
import Axios from 'axios'
import {Link} from 'react-router-dom';
import { FaEyeSlash, FaEye } from 'react-icons/fa';



import {runQuery} from './utils'
import {basicInfoQuery} from './Queries'


import TextCompareItem from './TextCompareItem'



class TextCompare extends React.Component {
  constructor(props){
    super(props)
    this.handleToggleShowAll = this.handleToggleShowAll.bind(this)
    this.mounted = ""
    this.state = {
      info: "",
      show: false,
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

  // TODO dupblicate of function in Text Component
  // needs refactoring
  arrangeTextInfo(info, resourceid){
      info.then((d) => {
        const bindings = d.data.results.bindings[0]
        const manifestations = d.data.results.bindings.map((b) => {
          return {
            manifestation: b.manifestation.value,
            manifestationTitle: b.manifestationTitle.value,
            transcription: b.manifestationCTranscription.value
          }
        })
        if (this.mounted === true){
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
              cmanifestation: bindings.cmanifestation.value,
              ctranscription: bindings.ctranscription.value,
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
    this.setState({show: this.props.show, baseText: this.props.baseText})

    if (this.props.isMainText){

      this.setState({info: this.props.info})
    }
    else{
      this.getTextInfo(this.props.expressionid)
    }
  }


  componentWillReceiveProps(nextProps){
    this.setState({baseText: nextProps.baseText})

    if (nextProps.isMainText){
      this.setState({info: nextProps.info})
    }
    else{
      this.getTextInfo(nextProps.expressionid)

    }
  }
    componentWillUnmount(){
      this.mounted = false;
  }

  render(){
    const displayComparisons = () => {
      if (this.state.info.manifestations){
        const texts = this.state.info.manifestations.map((m) => {
          return (
            <TextCompareItem
            key={m.transcription}
            base={this.props.baseText}
            compareTranscription={m.transcription}
            handleChangeBase={this.props.handleChangeBase}
            show={this.state.show}
            />
          )
        })
        return texts
      }
    }

  return (
    <div>
      {
        // the link to reroute is not quite working, because the base Text is not resetting, focusBlockChange might be better; but item structure will also need to be changed.
      }
      <p><Link to={"/text?resourceid=" + this.state.info.resourceid}>{this.state.info.resourceid}</Link>
      <span onClick={() => this.handleToggleShowAll()}>{this.state.show ? <FaEyeSlash/> : <FaEye/>}</span></p>
      <div className={this.state.show ? "unhidden" : "hidden"}>
      {displayComparisons()}
      </div>
    </div>

  );
  }
}

export default TextCompare;
