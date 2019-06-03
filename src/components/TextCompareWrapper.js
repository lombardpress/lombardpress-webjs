import React from 'react';
import Diff from 'diff-match-patch'
import Axios from 'axios'

import TextCompare from './TextCompare'


class TextCompareWrapper extends React.Component {
  constructor(props){
    super(props)
    this.handleCompare = this.handleToggleCompare.bind(this)
    this.handleChangeBase = this.handleChangeBase.bind(this)
    this.getText = this.getText.bind(this)
    this.mounted = ""
    this.state = {
      expressions: {},
      baseText: ""
    }

  }
  handleChangeBase(rawText){
    this.setState({baseText: rawText})
  }
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
    Axios.get("http://exist.scta.info/exist/apps/scta-app/csv-pct.xq?resourceid=" + ctranscription).
      then((text) => {
        this.setState({baseText: text.data})
      })
    }

  componentDidMount(){
    this.getText(this.props.info.ctranscription)
    const expressions = {}
    expressions[this.props.info.resourceid] = {id: this.props.info.resourceid, show: true}
    this.props.relatedExpressions.forEach((r) => {
      expressions[r] = {id: r, show: false}
    })
    this.setState({expressions: expressions})
  }
  componentWillReceiveProps(nextProps){
    this.getText(nextProps.info.ctranscription)
    const expressions = {}
    expressions[nextProps.info.resourceid] = {id: nextProps.info.resourceid, show: true}
    nextProps.relatedExpressions.forEach((r) => {
      expressions[r] = {id: r, show: false}
    })
    this.setState({expressions: expressions})
  }
  render(){
    const displayExpressions = () => {
      const exObject = this.state.expressions
      const expressions = Object.keys(exObject).map((key) => {
        const isMainText = this.props.info.resourceid === exObject[key].id ? true : false
        return (
          <div>
            {<TextCompare
              info={this.props.info}
              expressionid={exObject[key].id}
              isMainText={isMainText}
              handleChangeBase={this.handleChangeBase}
              baseText={this.state.baseText}
              show={exObject[key].show}
              />}
          </div>
        )
      })
      console.log("expressions", expressions)
      return expressions
    }

  return (
    <div className={this.props.hidden ? "hidden" : "showing"}>
    {displayExpressions()}
    </div>

  );
  }
}

export default TextCompareWrapper;
