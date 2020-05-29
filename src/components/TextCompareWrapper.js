import React from 'react';
import Axios from 'axios'
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import TextCompare from './TextCompare'


class TextCompareWrapper extends React.Component {
  constructor(props){
    super(props)
    this.handleToggleCompare = this.handleToggleCompare.bind(this)
    this.handleChangeBase = this.handleChangeBase.bind(this)
    this.handleCustomUpdateRelatedExpressions = this.handleCustomUpdateRelatedExpressions.bind(this)
    this.handleSetCustomExpressionId = this.handleSetCustomExpressionId.bind(this)
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
        _this.setState({baseText: text.data})
      })
    }

  componentDidMount(){
    // prevents check when prop.info is not set
    if (this.props.info){
      // prevents check when prop.info.relatedExpressions is not set
      if (this.props.info.relatedExpressions){
        this.getText(this.props.info.ctranscription)
        //create empty expressions object
        const expressions = {}
        // add first object which should be compare item for first/target resource
        expressions[this.props.info.resourceid] = {
          id: this.props.info.resourceid, 
          authorTitle: this.props.info.authorTitle, 
          longTitle: this.props.info.longTitle, 
          show: false
        }
        this.props.info.relatedExpressions.forEach((r) => {
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
    }
  }
  componentDidUpdate(prevProps, prevState){
    // only fire reload if "info resource" has changed"
    if ((prevProps.info.resourceid !== this.props.info.resourceid) || (prevState.customExpressionObject !== this.state.customExpressionObject)){
    // this conditional is needed, because props are waiting on multiple async calls.
    // when an async call finishes it will up; and the related Expression query last,
    // it will use the old ctranscription prop overriding the the update from the prop update from the other async call
    // TODO: above message is unclear; but this conditional seems important. Needs better explanation of why it is necessary
    if (prevProps.info.relatedExpressions){
      // this conditional may no longer be necessary based on first conditional check
      if (prevProps.info.ctranscription !== this.props.info.ctranscription){
        this.getText(this.props.info.ctranscription)
      }
      //create empty expressions object
      const expressions = {}
      // add first object which should be compare item for first/target resource
      expressions[this.props.info.resourceid] = {
        id: this.props.info.resourceid, 
          authorTitle: this.props.info.authorTitle, 
          longTitle: this.props.info.longTitle, 
          show: false,
      }
      //combine info.relatedExpressions with customExpression
      const newRelatedExpressions = this.props.info.relatedExpressions.concat(this.state.customExpressionObject)
      newRelatedExpressions.forEach((r) => {
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
  }
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
      <Form onSubmit={this.handleCustomUpdateRelatedExpressions} inline > 
      <FormControl inline size="sm" id="text" type="text" value={this.state.customExpressionId} placeholder="expression id" className="mr-sm-2" onChange={(e) => {this.handleSetCustomExpressionId(e.target.value)}}/>
      <Button inline size="sm"  type="submit" style={{margin: "2px"}}>Submit</Button>
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
