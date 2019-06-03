import React from 'react';
import Diff from 'diff-match-patch'
import Axios from 'axios'

import TextCompare from './TextCompare'


class TextCompareWrapper extends React.Component {
  constructor(props){
    super(props)
    this.handleCompare = this.handleToggleCompare.bind(this)
    this.mounted = ""
    this.state = {
      expressions: {}
    }

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

  componentDidMount(){
    const expressions = {}
    expressions[this.props.info.resourceid] = {id: this.props.info.resourceid, show: false}
    this.props.relatedExpressions.forEach((r) => {
      expressions[r] = {id: r, show: false}
    })
    this.setState({expressions: expressions})
  }
  componentWillReceiveProps(nextProps){
    const expressions = {}
    expressions[nextProps.info.resourceid] = {id: nextProps.info.resourceid, show: false}
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
            <p key={exObject[key].id} onClick={() => this.handleToggleCompare(exObject[key].id)}>{exObject[key].id}</p>
            {exObject[key].show && <TextCompare info={this.props.info} expressionid={exObject[key].id} isMainText={isMainText}/>}
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
