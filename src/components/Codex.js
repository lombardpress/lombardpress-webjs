import React from 'react';
import Container from 'react-bootstrap/Container';
import Surface2 from './Surface2'
import Surface3Wrapper from './Surface3Wrapper'
import SurfaceInfo from './SurfaceInfo'
import {Link} from 'react-router-dom';

import {runQuery} from './utils'
import {getCodexInfo, getCodexInfoFromSurface, getCodexInfoFromCanvas, getCodexInfoFromManifest} from './Queries'

class Codex extends React.Component {
  constructor(props){
    super(props)
    this.retrieveCodexInfo = this.retrieveCodexInfo.bind(this)
    this.handleSurfaceFocusChange = this.handleSurfaceFocusChange.bind(this)
    this.handleToggleShowContents = this.handleToggleShowContents.bind(this)
    this.handleSurface3Manifestations = this.handleSurface3Manifestations.bind(this)
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
  handleSurface3Manifestations(manifestations){
    // construct target manifestation from codex slug in focused surface
    // then use slug to find matching manifestation in manifestation list
    // TODO: not ideal to be constructing the manifestation id
    // TODO: it would better to begetting this directly from a lookup request
    const split1 = this.state.focusedSurface.split("/resource/")[1]
    const codexSlug = split1.split("/")[0]
    const surface3FocusedManifestation = manifestations ? manifestations.filter((m) => m.manifestation.includes(codexSlug))[0].manifestation : ""

    this.setState({
        surface3Manifestations: manifestations,
        surface3FocusedManifestation: surface3FocusedManifestation
      })
  }
  handleSurfaceFocusChange(surfaceid){
    this.setState({focusedSurface: surfaceid})
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

      }
    })
  }
  componentDidMount(){
    if (this.props.surfaceid){
      this.retrieveCodexInfo(this.props.surfaceid, "surface")
    }
    else if (this.props.canvasid){
      this.retrieveCodexInfo(this.props.canvasid, "canvas")
    }
    else if (this.props.manifestid){
      this.retrieveCodexInfo(this.props.manifestid, "manifest")
    }
    else{
      this.retrieveCodexInfo(this.props.codexid, "codex")
    }
  }
  componentWillReceiveProps(newProps){
    if (newProps.surfaceid && newProps.surfaceid !== this.props.surfaceid){
      this.retrieveCodexInfo(newProps.surfaceid, "surface")
    }
    else if (newProps.canvasid && newProps.canvasid !== this.props.canvasid){
      this.retrieveCodexInfo(newProps.canvasid, "canvas")
    }
    else if (newProps.manifestid && newProps.manifestid !== this.props.manifestid){
      this.retrieveCodexInfo(newProps.manifest, "manifest")
    }
    else if (newProps.codexid !== this.props.codexid){
      this.retrieveCodexInfo(newProps.codexid, "codex")
    }
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
      <Container fluid={true} className="Codex">
      <h1>{this.props.codexid}</h1>
      <div className="codexWrapper">
        <div className="codexContentsWrapper">
          <div className="codexContents">
          {
            // uncomment if show hide contents toggle is desired
            //<h2 onClick={this.handleToggleShowContents}>{this.state.showContents ? "Hide Contents" : "View Contents"}</h2>
          }
          <h2>Codex Contents</h2>
          {this.state.showContents && this.state.items && displayItems()}
          </div>
        </div>
        <div className="codexImage">
          <h1>Codex Pages</h1>
          {displayImages()}
         </div>
         <div className="surfaceInfo">
         {this.state.focusedSurface &&
          <SurfaceInfo surfaceid={this.state.focusedSurface} handleSurface3Manifestations={this.handleSurface3Manifestations}/>
         }
        </div>
      </div>

      </Container>
    );
  }
}

export default Codex;
