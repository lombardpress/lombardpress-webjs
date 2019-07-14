import React from 'react';
import Container from 'react-bootstrap/Container';
import Surface2 from './Surface2'
import {Link} from 'react-router-dom';

import {runQuery} from './utils'
import {getCodexInfo} from './Queries'

class Codex extends React.Component {
  constructor(props){
    super(props)
    this.retrieveCodexInfo = this.retrieveCodexInfo.bind(this)
    this.handleSurfaceFocusChange = this.handleSurfaceFocusChange.bind(this)
    this.handleToggleShowContents = this.handleToggleShowContents.bind(this)
    this.state = {
      items: {},
      title: "",
      focusedSurface: "",
      relatedCodices: [],
      showContents: false
    }
  }
  handleToggleShowContents(){
    this.setState((prevState) => {
      return{
        showContents: !prevState.showContents
      }
    })
  }
  handleSurfaceFocusChange(surfaceid){
    this.setState({focusedSurface: surfaceid})
  }
  retrieveCodexInfo(codexid){
    const codexInfo = runQuery(getCodexInfo(codexid))
    codexInfo.then((d) => {
      const data = d.data.results.bindings
      if (data.length > 0 && data[0].surface){
        this.setState({focusedSurface: data[0].surface.value})
        const expressionIdMap = data.map((d) => {
          return d.expression ? d.expression.value : ""
        })
        var unique = expressionIdMap.filter((v, i, a) => a.indexOf(v) === i);
        let expressionList = {}
        unique.forEach((e) => {
           expressionList[e] = []
        })
        data.forEach((d) => {
            const info = {
              expression: d.expression.value,
              expressionTitle: d.item_expression_title.value,
              manifestation: d.manifestation.value,
              surface: d.surface.value,
              surfaceTitle: d.surface_title.value,
              questionTitle: d.item_expression_question_title ? d.item_expression_question_title.value : ''
            }
          expressionList[d.expression.value].push(info)
        })
        this.setState({items: expressionList})

      }
    })
  }
  componentDidMount(){
    this.retrieveCodexInfo(this.props.codexid)
  }

  render(){
    const displayItems = () => {
      const items = Object.keys(this.state.items).map((key) => {
        return (
          <p key={this.state.items[key][0].expression}>
          <span>
              <span className="codexLink" onClick={() => {this.handleSurfaceFocusChange(this.state.items[key][0].surface)}}>
                {this.state.items[key][0].surfaceTitle}</span>{" - "}
              <span className="codexLink" onClick={() => {this.handleSurfaceFocusChange(this.state.items[key][this.state.items[key].length - 1].surface)}}>
                {this.state.items[key][this.state.items[key].length - 1].surfaceTitle}
              </span>
            </span>{": "}
            <Link to={"/text?resourceid=" + this.state.items[key][0].manifestation}>{this.state.items[key][0].expressionTitle}</Link>{": "}
            {this.state.items[key][0].questionTitle && this.state.items[key][0].questionTitle}
          </p>

        )
      })
      return items
    }
    return (
      <Container className="Codex">
      <h1>{this.props.codexid}</h1>
      <div className="codexWrapper">
        <div className="codexContentsWrapper">
          <div className="codexContents">
          <h2 onClick={this.handleToggleShowContents}>{this.state.showContents ? "Hide Contents" : "View Contents"}</h2>
          {this.state.showContents && this.state.items && displayItems()}
          </div>
          <div className="codexRelations">
            <h2>Show relations</h2>
          </div>
        </div>
        <div className="codexImage">
          {this.state.focusedSurface &&
            <Surface2 surfaceid={this.state.focusedSurface} topLevel={this.props.topLevel} handleSurfaceFocusChange={this.handleSurfaceFocusChange} width={500} hidden={false}/>
          }
         </div>
      </div>

      </Container>
    );
  }
}

export default Codex;
