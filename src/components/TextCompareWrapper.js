import React from 'react';
import Axios from 'axios'
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import TextCompare from './TextCompare'

import {runQuery} from './utils'
import {getRelatedExpressions} from './Queries'

class TextCompareWrapper extends React.Component {
  constructor(props){
    super(props)
    this.handleToggleCompare = this.handleToggleCompare.bind(this)
    this.handleChangeBase = this.handleChangeBase.bind(this)
    this.handleCustomUpdateRelatedExpressions = this.handleCustomUpdateRelatedExpressions.bind(this)
    this.handleSetCustomExpressionId = this.handleSetCustomExpressionId.bind(this)
    this.arrangeRelatedExpressions = this.arrangeRelatedExpressions.bind(this)
    this.getText = this.getText.bind(this)
    this.mounted = ""
    this.state = {
      expressions: {},
      baseText: "",
      customExpressionId: "", 
      customExpressionObject: {}
    }

  }
  handleSetCustomExpressionId(customExpressionId){
    this.setState({customExpressionId: customExpressionId})
  }
  handleCustomUpdateRelatedExpressions(e){
    e.preventDefault()
    const expressionObject = {
      resourceid: this.state.customExpressionId,
      relationLabel: "user added comparison"
    }
    this.setState({customExpressionObject: expressionObject})
  }
  handleChangeBase(rawText){
    this.setState({baseText: rawText})
  }
  //TODO: Doesn't seem to be called; should be deleted
  handleToggleCompare(expressionid){
    this.setState((prevState) => {
      const newExpressions = {...prevState.expressions}
      newExpressions[expressionid].show = !newExpressions[expressionid].show
      return {
        expressions: newExpressions
      }
    })
  }
  getText(ctranscription){
    const _this = this;
    Axios.get("https://exist.scta.info/exist/apps/scta-app/csv-pct.xq?resourceid=" + ctranscription)
      .then((text) => {
        if (this.mounted){
          _this.setState({baseText: text.data})
        }
      })
    }
  
    getRelatedExpressions(resourceid, offset, pagesize){
      const relatedExpressions = runQuery(getRelatedExpressions(resourceid, offset, pagesize))
      relatedExpressions.then((d) => {
      const bindings2 = d.data.results.bindings
      const relatedExpressions = bindings2.map((r) => {
          return {
            resourceid: r.isRelatedTo.value,
            relationLabel: r.label.value,
            referringResource: r.element ? r.element.value : "",
            author: r.author ? r.author.value : "",
            authorTitle: r.authorTitle ? r.authorTitle.value : "",
            longTitle: r.longTitle ? r.longTitle.value : ""
          }
        });
      this.arrangeRelatedExpressions(relatedExpressions);
      })
    }
    arrangeRelatedExpressions(relatedExpressions){
      //create empty expressions object
      const expressions = {}
      // add first object which should be compare item for first/target resource
      expressions[this.props.info.resourceid] = {
        id: this.props.info.resourceid, 
        authorTitle: this.props.info.authorTitle, 
        longTitle: this.props.info.longTitle, 
        show: false
      }
      relatedExpressions.forEach((r) => {
        expressions[r.resourceid] = {
          id: r.resourceid, 
          relationLabel: r.relationLabel, 
          referringResource: r.referringResource, 
          author: r.author,
          authorTitle: r.authorTitle, 
          longTitle: r.longTitle,
          show: false}
      })
      this.setState({expressions: expressions})
    }
  componentDidMount(){
    this.mounted = true
    if (this.props.info){
      this.getRelatedExpressions(this.props.info.resourceid, 0, 20)
    }
  }
  componentDidUpdate(prevProps, prevState){
    /// TODO ADD STATE FOR OFFSET
    /// and click handler for page select
    // adjust update to respond to state changes


    // only fire reload if "info resource" has changed"
    if (prevProps.info.resourceid !== this.props.info.resourceid){
      this.getRelatedExpressions(this.props.info.resourceid, 0, 20)
    }
    if (prevState.customExpressionObject !== this.state.customExpressionObject){
      const r = this.state.customExpressionObject
      const newExpression = {
        id: r.resourceid, 
        relationLabel: r.relationLabel, 
      }
      
      this.setState((prevState) => {
        return {expressions: {...prevState.expressions, newExpression}}
      })
    }
  }
  componentWillUnmount(){
    this.mounted = false
  }


  render(){
    const displayExpressions = () => {
      const exObject = this.state.expressions
      const expressions = Object.keys(exObject).map((key) => {
        const isMainText = this.props.info.resourceid === exObject[key].id ? true : false
        return (
          <div key={this.state.expressions[key].id}>
            {<TextCompare
              info={this.props.info}
              expressionid={exObject[key].id}
              relationLabel={exObject[key].relationLabel}
              referringResource={exObject[key].referringResource}
              author={exObject[key].author}
              authorTitle={exObject[key].authorTitle}
              longTitle={exObject[key].longTitle}
              isMainText={isMainText}
              handleChangeBase={this.handleChangeBase}
              baseText={this.state.baseText}
              show={exObject[key].show}
              surfaceWidth={this.props.surfaceWidth}
              />}
          </div>
        )
      })
      return expressions
    }

  return (
    <Container className={this.props.hidden ? "hidden" : "showing"}>
    <h4>Text Comparisons</h4>
    {displayExpressions()}
    <div style={{"borderBottom": "1px solid rgba(0, 0, 0, 0.1)", padding: "5px"}}>
      <p style={{fontSize: "12px"}}>Create custom user compare</p>
      <Form onSubmit={this.handleCustomUpdateRelatedExpressions} inline="true" > 
      <FormControl inline="true" size="sm" id="text" type="text" value={this.state.customExpressionId} placeholder="expression id" className="mr-sm-2" onChange={(e) => {this.handleSetCustomExpressionId(e.target.value)}}/>
      <Button inline="true" size="sm"  type="submit" style={{margin: "2px"}}>Submit</Button>
    </Form>
   </div>

    <hr/>
    <div>
      <p>Other Comparison/Connection Visualizations</p>
      <p><a target="_blank" rel="noopener noreferrer" href={"http://lombardpress.org/collation-vizualizer/index.html?id=" + this.props.info.resourceid}>Collation Overlay</a></p>
      <p><a target="_blank" rel="noopener noreferrer" href={"https://scta.github.io/networks-explorer/?resourceid=" + this.props.info.resourceid}>View Reference Connections</a></p>
      <p><a target="_blank" rel="noopener noreferrer" href={"https://scta.github.io/networks-explorer/topicconnections.html?resourceid=" + this.props.info.resourceid}>View Topic Connections</a></p>
    </div>
    </Container>

  );
  }
}

export default TextCompareWrapper;
