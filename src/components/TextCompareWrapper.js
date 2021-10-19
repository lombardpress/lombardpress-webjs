import React from 'react';
import Axios from 'axios'
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import TextCompare from './TextCompare'
import NgramDisplay from './NgramDisplay'

import { runQuery } from './utils'
import { getRelatedExpressions } from './Queries'
import {textReduce} from './utils'

class TextCompareWrapper extends React.Component {
  constructor(props) {
    super(props)
    this.handleToggleCompare = this.handleToggleCompare.bind(this)
    this.handleChangeBase = this.handleChangeBase.bind(this)
    this.handleCustomUpdateRelatedExpressions = this.handleCustomUpdateRelatedExpressions.bind(this)
    this.handleSetCustomExpressionId = this.handleSetCustomExpressionId.bind(this)
    this.handleToggleAllChildren = this.handleToggleAllChildren.bind(this)
    this.handleToggleAllChildrenImages = this.handleToggleAllChildrenImages.bind(this)
    this.getText = this.getText.bind(this)
    this.mounted = ""
    this.state = {
      expressions: [],
      expressionsCumulative: [],
      page: 1,
      intendedPage: 1,
      pagesize: 10,
      nextPage: 2,
      previousPage: undefined,
      offset: 0,
      rangeStart: 1,
      rangeEnd: 20,
      baseText: "",
      customExpressionId: "",
      customExpressionObject: {},
      showAllChildren: false,
      showAllChildrenImages: false
    }

  }
  handleToggleAllChildren(){
    this.setState((prevState) => {
      return{
        showAllChildren: !prevState.showAllChildren
      }
    })
  }
  handleToggleAllChildrenImages(){
    this.setState((prevState) => {
      return{
        showAllChildrenImages: !prevState.showAllChildrenImages
      }
    })
  }
  handleSetCustomExpressionId(customExpressionId) {
    this.setState({ customExpressionId: customExpressionId })
  }
  handleCustomUpdateRelatedExpressions(e) {
    e.preventDefault()
    const expressionObject = {
      resourceid: this.state.customExpressionId,
      relationLabel: "user added comparison"
    }
    this.setState({ customExpressionObject: expressionObject })
  }
  handleChangeBase(rawText) {
    this.setState({ baseText: rawText })
  }
  //TODO: Doesn't seem to be called; should be deleted
  handleToggleCompare(expressionid) {
    this.setState((prevState) => {
      const newExpressions = { ...prevState.expressions }
      newExpressions[expressionid].show = !newExpressions[expressionid].show
      return {
        expressions: newExpressions
      }
    })
  }
  getText(ctranscription) {
    const _this = this;
    Axios.get("https://exist.scta.info/exist/apps/scta-app/csv-pct.xq?resourceid=" + ctranscription)
      .then((text) => {
        if (this.mounted) {
          let reducedText = text.data;
            if (this.props.selectionRange.wordRange){
              const wordRange = _this.props.selectionRange.wordRange.start + "-" + _this.props.selectionRange.wordRange.end
              reducedText = textReduce(text.data, wordRange)
            }
          _this.setState({ baseText: reducedText })
        }
      })
  }
  /**
   * @description initiates sparql requests and parses initial results.
   * @param {string} resourceid - scta url for expression object
   * @param {integer} page - page to start on in paging results
   * @param {integer} pagesize - length of page results
   */
  getRelatedExpressions(resourceid, page, pagesize) {
    const offset = (page - 1) * pagesize
    const rangeStart = (this.props.selectionRange && this.props.selectionRange.wordRange) ? this.props.selectionRange.wordRange.start : "" ;
    const rangeEnd = (this.props.selectionRange && this.props.selectionRange.wordRange) ? this.props.selectionRange.wordRange.end : "";
    const relatedExpressions = runQuery(getRelatedExpressions(resourceid, offset, pagesize, rangeStart, rangeEnd))
    relatedExpressions.then((d) => {
      const bindings2 = d.data.results.bindings
      const expressions = []
      // if target resource is NOT structureCollect, 
      // then add first object which should be compare item for first/target resource
      
        expressions.push({
          id: this.props.info.resourceid,
          authorTitle: this.props.info.authorTitle,
          longTitle: this.props.info.longTitle,
          show: false
        });
      //arrange sparql results into an object with resourceids as keys
      bindings2.forEach((r) => {
        expressions.push({
          id: r.isRelatedTo.value,
          relationLabel: r.label.value,
          referringResource: r.element ? r.element.value : "",
          author: r.author ? r.author.value : "",
          authorTitle: r.authorTitle ? r.authorTitle.value : "",
          longTitle: r.longTitle ? r.longTitle.value : "",
          show: false,
          isRelatedToRange: r.isRelatedToRangeStart && r.isRelatedToRangeEnd ? r.isRelatedToRangeStart.value + '-' + r.isRelatedToRangeEnd.value : "",
          parentBlock: r.parentBlock ? r.parentBlock.value : "",

        })
      })
      // set state with new related expressions results and updates to paging information
      if (this.mounted) {
      this.setState((prevState) => {
        return {
          expressions: expressions,
          // expressionCumulative is dangerous, because the array will continue to fill up everytime paging is changed 
          // even the page contents have already been added
          expressionsCumulative: prevState.expressionsCumulative.concat(expressions),
          intendedPage: page,
          nextPage: page + 1,
          previousPage: page > 1 ? page - 1 : undefined,
          offset: (page - 1) * pagesize,
          rangeStart: ((page - 1) * pagesize) + 1,
          rangeEnd: pagesize * page
        }
      })
      }
    })
  }
  componentDidMount() {
    this.mounted = true
    if (this.props.info) {
      this.getRelatedExpressions(this.props.info.resourceid, this.state.page, this.state.pagesize)
      if (this.props.info.structureType !== "http://scta.info/resource/structureCollection"){
        this.getText(this.props.info.ctranscription)
      }
    }
  }
  componentDidUpdate(prevProps, prevState) {
    // if resource id changes or results paging, then perform new query
    if (prevProps.info.resourceid !== this.props.info.resourceid || prevState.page !== this.state.page || prevProps.selectionRange !== this.props.selectionRange) {
      const startPage = prevProps.info.resourceid !== this.props.info.resourceid ? 1 : this.state.page
      this.getRelatedExpressions(this.props.info.resourceid, startPage, this.state.pagesize)
      if (this.props.info.structureType !== "http://scta.info/resource/structureCollection"){
        this.getText(this.props.info.ctranscription)
      }
    }
    // if a custom object has been added; add custom object to state.expressions
    if (prevState.customExpressionObject !== this.state.customExpressionObject) {
      const r = this.state.customExpressionObject
      const newExpression = {
        id: r.resourceid,
        relationLabel: r.relationLabel,
      }
      this.setState((prevState) => {
        return {
          expressions: [ ...prevState.expressions, newExpression ]
        }
      })
    }
  }
  componentWillUnmount() {
    this.mounted = false
  }
  render() {
    const displayExpressions = () => {
      
      const expressions = this.state.expressions.map((i, index) => {
        const isMainText = this.props.info.resourceid === i.id ? true : false
        return (
          <div key={index + "-" + i.id}>
            {<TextCompare
              info={this.props.info}
              expressionid={i.id}
              relationLabel={i.relationLabel}
              referringResource={i.referringResource}
              author={i.author}
              authorTitle={i.authorTitle}
              longTitle={i.longTitle}
              isMainText={isMainText}
              handleChangeBase={this.handleChangeBase}
              baseText={this.state.baseText}
              show={this.state.showAllChildren ? true : i.show}
              showImages={this.state.showAllChildrenImages ? true : i.show}
              surfaceWidth={this.props.surfaceWidth}
              isRelatedToRange={i.isRelatedToRange}
              targetRange={(this.props.selectionRange && this.props.selectionRange.wordRange) ? this.props.selectionRange.wordRange.start + "-" + this.props.selectionRange.wordRange.end : ""}
            />}
          </div>
        )
      })
      return expressions
    }
    const displayPagination = () => {
      return (
        <div>
        {
          (Object.keys(this.state.expressions).length > this.state.pagesize || this.state.rangeEnd > this.state.pagesize) &&
        <p className="small">
          {this.state.previousPage &&
            <span>
              <span className="lbp-span-link" onClick={() => this.setState({ page: this.state.previousPage })}>Previous {this.state.previousPage}</span>  
              <span> | </span>
            </span>
              }
          <span>Current Page: </span>
          <FormControl style={{width: "40px", display: "inline"}} inline="true" size="sm" id="text" type="text" onChange={(e) => this.setState({ intendedPage: e.target.value })} value={this.state.intendedPage}></FormControl>
          <Button style={{display: "inline"}}inline="true" size="sm" onClick={(e) => this.setState({ page: parseInt(this.state.intendedPage) })}>Go</Button>
          
          <span>({this.state.rangeStart} - {this.state.rangeEnd})</span>
          {Object.keys(this.state.expressions).length > this.state.pagesize && 
            <span>
              <span> | </span> 
              <span className="lbp-span-link" onClick={() => this.setState({ page: this.state.nextPage })}>Next: {this.state.nextPage}</span>
            </span>
          }
        </p>
          }
        </div>
      )
    }

    return (
      <Container className={this.props.hidden ? "hidden" : "showing"}>
        <h4>Text Comparisons</h4>
        {displayPagination()}
        <p className="small"><a href="https://lombardpress.org/adfontes/" target="_blank" rel="noopener noreferrer">Advanced Index and Filtering</a></p>
        <p className="small lbp-span-link" onClick={this.handleToggleAllChildren}>Toggle All Children</p>
        {this.state.showAllChildren && <p className="small lbp-span-link" onClick={this.handleToggleAllChildrenImages}>Toggle All Children Images</p>}
        <hr />
        {displayExpressions()}
        <hr />
        {displayPagination()}
        <div style={{ "borderBottom": "1px solid rgba(0, 0, 0, 0.1)", padding: "5px" }}>
          <p style={{ fontSize: "12px" }}>Create custom user compare</p>
          <Form onSubmit={this.handleCustomUpdateRelatedExpressions} inline="true" >
            <FormControl inline="true" size="sm" id="text" type="text" value={this.state.customExpressionId} placeholder="expression id" className="mr-sm-2" onChange={(e) => { this.handleSetCustomExpressionId(e.target.value) }} />
            <Button inline="true" size="sm" type="submit" style={{ margin: "2px" }}>Submit</Button>
          </Form>
        </div>

        <hr />
        <div>
          <p>Other Comparison/Connection Visualizations</p>
          <p><a target="_blank" rel="noopener noreferrer" href={"http://lombardpress.org/collation-vizualizer/index.html?id=" + this.props.info.resourceid}>Collation Overlay</a></p>
          <p><a target="_blank" rel="noopener noreferrer" href={"https://lombardpress.org/collation-vizualizer/collatexView.html?id=" + this.props.info.resourceid}>Collation Table Overlay</a></p>
          <p><a target="_blank" rel="noopener noreferrer" href={"https://scta.github.io/networks-explorer/?resourceid=" + this.props.info.resourceid}>View Reference Connections</a></p>
          <p><a target="_blank" rel="noopener noreferrer" href={"https://scta.github.io/networks-explorer/topicconnections.html?resourceid=" + this.props.info.resourceid}>View Topic Connections</a></p>
        </div>
        <div>
        <NgramDisplay info={this.props.info}
          handleChangeBase={this.handleChangeBase}
          baseText={this.state.baseText}
          surfaceWidth={this.props.surfaceWidth}
          resourceid={this.props.info.resourceid}
          markedExpressions={this.state.expressionsCumulative}>
        </NgramDisplay>
        </div>

        
        
      </Container>

    );
  }
}

export default TextCompareWrapper;
