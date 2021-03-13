import React from 'react';
import {Link} from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import TextPreview from '@bit/jeffreycwitt.lbp.text-preview'
import {runQuery} from './utils'
import {getCanonicalTranscription} from '../queries/TextPreviewWrapperQueries'
import {FaToggleOn, FaToggleOff} from 'react-icons/fa';

class TextPreviewWrapper extends React.Component {
  constructor(props){
    super(props)
    this.handleToggleShowTokenPosition = this.handleToggleShowTokenPosition.bind(this)
    this.mounted = false
    this.state = {
      tresourceid: "",
      showTokenPosition: false
    }
  }
  handleToggleShowTokenPosition(){
    this.setState((prevState)=> {
      return {showTokenPosition: !prevState.showTokenPosition}
    })
  }
  getTranscriptionId(textPreviewResourceId){
    const info = runQuery(getCanonicalTranscription(textPreviewResourceId))

    info.then((d) => {
      if (this.mounted){
        this.setState({tresourceid: d.data.results.bindings[0].ctranscription.value})
      }
    })
    .catch((e) => {
      this.setState({tresourceid: ""})
      //console.log("transcription id could not be found", e)
      // uncomment if you want to automatically redirect
        //this.props.handleFocusChange(textPreviewResourceId)
    })


  }
  componentDidMount(){
    this.mounted = true
    this.getTranscriptionId(this.props.textPreviewResourceId)
  }
  componentDidUpdate(prevProps){
    if (prevProps.textPreviewResourceId !== this.props.textPreviewResourceId){
      this.getTranscriptionId(this.props.textPreviewResourceId)
    }
  }
  componentWillUnmount()
  {
    this.mounted = false
  }
  render(){
    const link = (this.props.textPreviewStart && this.props.textPreviewEnd) 
    ? this.state.tresourceid + "@" + this.props.textPreviewStart + "-" + this.props.textPreviewEnd
    : this.state.tresourceid
    const referringRange = (this.props.referringSelectionRange && this.props.referringSelectionRange.wordRange) && this.props.referringSelectionRange.wordRange.start + "-" + this.props.referringSelectionRange.wordRange.end
    // const referringStart = (this.props.referringSelectionRange && this.props.referringSelectionRange.wordRange) && this.props.referringSelectionRange.wordRange.start
    // const referringEnd = (this.props.referringSelectionRange && this.props.referringSelectionRange.wordRange) && this.props.referringSelectionRange.wordRange.end
    return (
      <Container className={this.props.hidden ? "hidden" : "showing"}>
      {/* <p>Go to: <span className="lbp-span-link" onClick={() => this.props.handleFocusChange(this.state.tresourceid)}>{this.state.tresourceid}</span></p> */}
      <p>Go to: <Link onClick={() => {this.props.handleTextPreviewFocusChange([{id: this.props.referringResource, range: referringRange}])}} to={"/text?resourceid=" + link}>{link}</Link></p>
      {
       this.state.tresourceid && 
       <div>
         <TextPreview tresourceid={this.state.tresourceid} start={parseInt(this.props.textPreviewStart)} stop={parseInt(this.props.textPreviewEnd)} context={true} showTokenPosition={this.state.showTokenPosition}/>
      <span className="lbp-span-link" alt="show word token position" onClick={this.handleToggleShowTokenPosition}>{this.state.showTokenPosition ? <FaToggleOn/> : <FaToggleOff/>}</span>
       </div>
      }
      </Container>
    );
  }
}

export default TextPreviewWrapper;
