import React from 'react';
import Container from 'react-bootstrap/Container';
import TextPreview from '@bit/jeffreycwitt.lbp.text-preview'
import {runQuery} from './utils'
import {getCanonicalTranscription} from '../queries/TextPreviewWrapperQueries'

class TextPreviewWrapper extends React.Component {
  constructor(props){
    super(props)
    this.mounted = false
    this.state = {
      tresourceid: ""
    }
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
    return (
      <Container className={this.props.hidden ? "hidden" : "showing"}>
      <p>Go to: <span className="lbp-span-link" onClick={() => this.props.handleFocusChange(this.state.tresourceid)}>{this.state.tresourceid}</span></p>
      {
       this.state.tresourceid && <TextPreview tresourceid={this.state.tresourceid}/>
      }
      </Container>
    );
  }
}

export default TextPreviewWrapper;
