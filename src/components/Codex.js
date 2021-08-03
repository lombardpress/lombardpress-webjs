import React from 'react';
import Surface2 from './Surface2'
import Surface3Wrapper from './Surface3Wrapper'
//import {Link} from 'react-router-dom';

import {runQuery} from './utils'
import {getCodexInfo, getCodexInfoFromSurface, getCodexInfoFromCanvas, getCodexInfoFromManifest} from './Queries'

class Codex extends React.Component {
  constructor(props){
    super(props)
    this.retrieveCodexInfo = this.retrieveCodexInfo.bind(this)
    this.handleSurfaceFocusChange = this.handleSurfaceFocusChange.bind(this)
    this.handleToggleShowContents = this.handleToggleShowContents.bind(this)
    //this.handleSurface3Manifestations = this.handleSurface3Manifestations.bind(this)
    this.state = {
      items: {},
      title: "",
      focusedSurface: "",
      relatedCodices: [],
      showContents: true,
      surface3Manifestations: [],
      surface3FocusedManifestation: ""
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
    //this.setState({focusedSurface: surfaceid})
    this.props.handleSetFocus(surfaceid)
  }
  retrieveCodexInfo(id, type){
    let codexInfo = undefined
    if (type === "surface"){
      codexInfo = runQuery(getCodexInfoFromSurface(id))
    }
    else if (type === "canvas"){
      codexInfo = runQuery(getCodexInfoFromCanvas(id))
    }
    else if (type === "manifest"){
      codexInfo = runQuery(getCodexInfoFromManifest(id))
    }
    else{
      codexInfo = runQuery(getCodexInfo(id))
    }
    codexInfo.then((d) => {
      const data = d.data.results.bindings
      if (data.length > 0 && data[0].surface){
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
        let focusedSurface = ""
        if (type === "surface"){
           focusedSurface = id
         }
         else if (type === "canvas"){
           focusedSurface = data[0].surfaceFocus.value
         }
         else{
           focusedSurface = data[0].surface.value
         }
        this.setState({items: expressionList, focusedSurface: focusedSurface})
        this.props.handleSurfaceFocusChange(focusedSurface)

      }
    })
  }
  componentDidMount(){
    this.retrieveCodexInfo(this.props.resourceid, this.props.codexResourceType)
  }
  componentDidUpdate(prevProps){
    if (this.props.resourceid && this.props.resourceid !== prevProps.resourceid){
      this.retrieveCodexInfo(this.props.resourceid, this.props.codexResourceType)
  }
  }

  render(){
    const displayImages = () => {
      if (this.state.surface3Manifestations.length > 0){
        return <Surface3Wrapper manifestations={this.state.surface3Manifestations} focusedManifestation={this.state.surface3FocusedManifestation} annotationsDisplay="paragraph" width="501" hidden={false}/>
      }
      else if (this.state.focusedSurface){
        return <Surface2 surfaceid={this.state.focusedSurface} lineFocusId="" topLevel={this.props.topLevel} handleSurfaceFocusChange={this.handleSurfaceFocusChange} width={"501"} annotationsDisplay={false} hidden={false}/>
      }
      else{
        return null
      }

    }
    return (
      <div className="codexImage">
          <h1>Codex Pages</h1>
          {displayImages()}
         </div>
    );
  }
}

export default Codex;
