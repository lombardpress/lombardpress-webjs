import React from 'react';
import PropTypes from 'prop-types';
import Axios from 'axios'
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
/**
* XML view show component
**/
class XmlView extends React.Component {

  constructor(props){
    super(props)
    this.mount = false
    this.retrieveXML = this.retrieveXML.bind(this)
    this.state = {
      xmlstring: ""
    }
  }
  retrieveXML(tresourceid){
    const xmlurl = "https://exist.scta.info/exist/apps/scta-app/document/" + tresourceid.split("/resource/")[1]
    Axios.get(xmlurl).then((d) => {
      if (this.mount){
        this.setState({xmlstring: d.data})
      }
    })

  }
  componentDidMount(){
    this.mount = true
    //condition to make sure tresourceid is defined before trying to parse and retrieve
    // though this should never since tresourceid is a required prop
    if (this.props.tresourceid){
      this.retrieveXML(this.props.tresourceid)
    }

  }
  componentDidUpdate(prevProps){
    if (this.props.tresourceid !== prevProps.tresourceid){
      this.retrieveXML(this.props.tresourceid)
    }
  }
  componentWillUnmount(){
    this.mount = false
  }

  render(){
    return (
      <div className={this.props.hidden ? "hidden" : "showing"}>
      <SyntaxHighlighter language="xml" style={docco} showLineNumbers>
        {this.state.xmlstring}
      </SyntaxHighlighter>
      </div>
    )
  }
}

XmlView.propTypes = {
  /**
  * transcription resource id of transcription for desired xml view
  *
  * TODO: Component is currently splitting the id and constructing the xml based
  * on a prior knowledge of where xml is; this really should be retrieved from the resource id
  * but the xml look up should happen outside of the XmlView Component in order to keep this component simple
  * and making only request directly to the xml file
  */
  tresourceid: PropTypes.string.isRequired,
  /**
  * hidden designates whether the component should be hidden after mounting
  */
  hidden: PropTypes.bool,
}
export default XmlView;
