//vendor imports
import React from 'react';
import PropTypes from 'prop-types';

import Button from 'react-bootstrap/Button';
import {Link} from 'react-router-dom';
import {FaExternalLinkAlt} from 'react-icons/fa';


//internal imports
import Surface3Wrapper from './Surface3Wrapper'
//import Comments from './Comments'
import {runQuery} from './utils'
import {getSurfaceInfo} from '../queries/SurfaceInfoQuery'

class SurfaceInfo extends React.Component {
  constructor(props){
    super(props)
    this.handleToggleRelatedDiscussion = this.handleToggleRelatedDiscussion.bind(this)
    this.handleSurface3Manifestations = this.handleSurface3Manifestations.bind(this)
    this.handleToggleShowQuery = this.handleToggleShowQuery.bind(this)
    this.handleToggleShowImages = this.handleToggleShowImages.bind(this)
    this.state = {
      expressions: [],
      surfaceMap: {},
      showTextRegion: false,
      showQuery: false,
      query: ""
    }
  }
  handleToggleShowQuery(){
    this.setState((prevState) => {
      return {
        showQuery: !prevState.showQuery
      }
    })
  }
  handleSurface3Manifestations(manifestations, eid){
    console.log("test", manifestations, eid)
    let newManifestations = ""
    if (typeof manifestations === "object"){
      newManifestations = manifestations.map((m) =>{
        return {
          manifestation: m,
          manifestationTitle: m.split("/resource/")[1],
          transcription: ""
        }
      })
    }
    // sometimes there is only manifestation not in an array
    else if (manifestations){
      newManifestations = [{
        manifestation: manifestations,
        manifestationTitle: manifestations.split("/resource/")[1],
        transcription: ""
      }]
    }
    const split1 = this.props.surfaceid.split("/resource/")[1]
    const codexSlug = split1.split("/")[0]
    const surface3FocusedManifestation = newManifestations ? newManifestations.filter((m) => m.manifestation.includes(codexSlug))[0].manifestation : ""

    return {
      surface3Manifestations: newManifestations,
      surface3FocusedManifestation: surface3FocusedManifestation
    } 
  }
  
  handleToggleRelatedDiscussion(eid){
    this.setState((prevState) => {
      const target = prevState.expressions.find((e) => e.expressionid === eid )
      target.showComments = !target.showComments
      const newExpressions = [...prevState.expressions]
      return {
        expressions: newExpressions
      }
    })

  }
  handleToggleRelatedSurfaces(eid){
    this.setState((prevState) => {
      const target = prevState.expressions.find((e) => e.expressionid === eid )
      target.showRelatedSurfaces = !target.showRelatedSurfaces
      const newExpressions = [...prevState.expressions]
      return {
        expressions: newExpressions
      }
    })

  }
  handleToggleShowImages(eid){
    this.setState((prevState) => {
      const target = prevState.expressions.find((e) => e.expressionid === eid )
      target.showImages = !target.showImages
      const newExpressions = [...prevState.expressions]
      return {
        expressions: newExpressions
      }
    })

  }

  
  retrieveSurfaceInfo(surfaceid){
    const query = getSurfaceInfo(surfaceid)
    const surfaceInfo = runQuery(query)
    surfaceInfo.then((d) => {
      if (d.data["@graph"]){
        const data = d.data["@graph"]
        const expressions = [] 
        data.forEach((e) => {
          console.log("e", e)
          if (e.hasManifestation){
            const surface3Manifestations = this.handleSurface3Manifestations(e.hasManifestation, e["@id"])
            console.log("test", surface3Manifestations)
            expressions.push({
              expressionid: e["@id"],
              manifestations: e.hasManifestation,
              surface3Manifestations: surface3Manifestations,
              showComments: false,
              showRelatedSurfaces: false,
              showImages: false,
            })
          }
          else{
            return null
          }
        })
        let surfaceMap = {}
        data.forEach((e) => {
          if (e.isOnSurface){
            surfaceMap[e["@id"]] = e.isOnSurface
          }
        })
        console.log("expressions", expressions)
        this.setState({
          expressions: expressions,
          surfaceMap: surfaceMap,
          query: query
        })
      }
    })
  }

  componentDidMount(){
    this.retrieveSurfaceInfo(this.props.surfaceid)
  }
  componentDidUpdate(prevProps){
    if (this.props.surfaceid !== prevProps.surfaceid){
      this.retrieveSurfaceInfo(this.props.surfaceid)
    }
  }
  render(){
    const displayExpressions = () => {
      if (this.state.expressions.length > 0){
        const expressions = this.state.expressions.map((e) => {
          let manifestations = ""
          // sometimes there are several manifestations
          if (typeof(e.hasManifestation) === "object"){
            manifestations = e.hasManifestation.map((m) => {
              return (
                  <div key={m}>
                  <span>{m} <Link to={"/text?resourceid=" + m}><FaExternalLinkAlt/></Link></span>
                  <br/>
                  <span style={{"textIndent": "10px"}}>...Appearing on Surface {this.state.surfaceMap[m]} <Link to={"/text?resourceid=" + this.state.surfaceMap[m]}><FaExternalLinkAlt/></Link></span>
                  <br/>
                  <br/>
                  </div>
                )
              })
            }
            // sometimes there is only manifestation
            else if (e.hasManifestation){
              manifestations = (
                  <div key={e.hasManifestation}>
                  <span>{e.hasManifestation} <Link to={"/text?resourceid=" + e.hasManifestation}><FaExternalLinkAlt/></Link></span>
                  <br/>
                  <span style={{"textIndent": "10px"}}>...Appearing on Surface {this.state.surfaceMap[e.hasManifestation]} <Link to={"/text?resourceid=" + this.state.surfaceMap[e.hasManifestation]}><FaExternalLinkAlt/></Link></span>
                  <br/>
                  <br/>
                  </div>
                )
              }
              else{
                manifestations = []
              }
          return (
            <div key={e.expressionid}>
            <hr/>
            <p>{e.expressionid} <Link to={"/text?resourceid=" + e.expressionid}><FaExternalLinkAlt/></Link></p>
            <Button variant="outline-primary" size="sm" block onClick={() => this.handleToggleShowImages(e.expressionid)}>{e.showImages ? "Hide Images" : "Show Images"}</Button>
              <br/>
              {(e.showImages && (e.surface3Manifestations && e.surface3Manifestations.surface3Manifestations.length > 0)) &&
              <Surface3Wrapper key={e.expressionid} manifestations={e.surface3Manifestations.surface3Manifestations} focusedManifestation={e.surface3Manifestations.surface3FocusedManifestation} annotationsDisplay="paragraph" width="501" hidden={false}/>
              }
            {e.showRelatedSurfaces ?
              <div>
                <Button variant="outline-primary" size="sm" block onClick={() => {this.handleToggleRelatedSurfaces(e.expressionid)}}>Hide Related Codices</Button>
              <br/>
              {manifestations}
              </div> :
              <div>
                <Button variant="outline-primary" size="sm" block onClick={() => {this.handleToggleRelatedSurfaces(e.expressionid)}}>Show Related Codices</Button>
                <br/>
              </div>
            }
            </div>
          )
        })
        return expressions
      }
      else{
        return null
      }
    }

    return (
      <div className={this.props.hidden ? "hidden" : "showing"}>
      <h1>Page Info</h1>
        <div style={{"fontSize": "16px"}}>
        <h1>Text objects on this page <Button size="sm" className="lbp-span-link" onClick={this.handleToggleShowQuery}>{this.state.showQuery ? "Hide Proof" : "Prove It!"}</Button></h1>
        {this.state.showQuery && <p>{this.state.query}</p>}
        {displayExpressions()}
        </div>

      </div>
    );
  }
}

SurfaceInfo.propTypes = {
  /**
  * SCTA rdf url surfaceid to use when performing SPARQL query
  */
 surfaceid: PropTypes.string.isRequired,
 /**
  * a parent function to be triggered to indicate a new view display; namely "swithc to viewTextFocused Region"
  */
 handleSurface3Manifestations: PropTypes.func
}


export default SurfaceInfo;
