import React from 'react';
import Axios from 'axios'
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
//import xml from 'react-syntax-highlighter/dist/esm/languages/hljs/xml';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

class XmlView extends React.Component {

  constructor(props){
    super(props)
    this.mount = false
    this.retrieveXML = this.retrieveXML.bind(this)
    this.state = {
      xmlstring: ""
    }
  }
  retrieveXML(info){

    //construct file url request ot exist db to get a cors enabled copy of the text (github does not serve files with cors enabled)
    // const doc = info.cdoc
    // const topLevel = info.topLevel
    // const docFragment = doc.split("/master/")[1]
    // const topLevelFragment = info.topLevel.split("/resource/")[1]

    //const xmlurl = "http://exist.scta.info/exist/apps/scta-app/text/" + topLevelFragment + "/" + docFragment;
    const xmlurl = info.cxml
    // const xmlDoc = loadXMLDoc(xmlurl)
    // console.log("xmlDoc", xmlDoc, info.resourceid)
    // const p = xmlDoc.evaluate("//tei:p[@xml:id='" + info.resourceid + "']", xmlDoc, nsResolver, XPathResult.ANY_TYPE, null);
    // console.log("paragraph", p)
    Axios.get(xmlurl).then((d) => {
      if (this.mount){
        this.setState({xmlstring: d.data})
      }
    })

  }
  componentDidMount(){
    this.mount = true
    this.retrieveXML(this.props.info)

  }
  componentWillReceiveProps(nextProps){
    if (nextProps.info !== this.props.info){
      this.retrieveXML(nextProps.info)
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

export default XmlView;
