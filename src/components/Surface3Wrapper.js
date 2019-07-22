import React from 'react';
import Surface3 from './Surface3';

import { FaList, FaFile, FaParagraph} from 'react-icons/fa';

//TODO: surface 3 needs to run in a wrapper which allows the user to choose between manifestations.
//TODO: rdf dbase needs to include first line numbers for paragraphs that start in the middle of al line.

class Surface3Wrapper extends React.Component {
  constructor(props){
    super(props)
    this.handleChangeManifestation = this.handleChangeManifestation.bind(this)
    this.handleToggleTextLinesView = this.handleToggleTextLinesView.bind(this)
    this.state = {
      manifestations: [],
      focusedManifestation: "",
      focusedManifestationSlug: null,
      annotationsDisplay: "lines"
    }
  }
  handleToggleTextLinesView(view){
    //this.retrieveSurfaceInfo(this.state.previous)
    this.setState((prevState) => {
      return {annotationsDisplay: view}
    })
  }
  handleChangeManifestation(focusedManifestation){
    //TODO not best way to get manifestation slug; it should probably be retrieved from info query
    const slug = focusedManifestation.split("/resource/")[1].split("/")[1]
    this.setState({focusedManifestation: focusedManifestation, focusedManifestationSlug: slug})
  }
  componentDidMount(){
    if (this.props.manifestations){
      this.setState((prevState) => {
        return {
          manifestations: this.props.manifestations,
        }
      })
    }
  }
  componentWillReceiveProps(nextProps){
    if (nextProps.manifestations !== this.props.manifestations){
      this.setState((prevState) => {
        return {
          manifestations: nextProps.manifestations,
        }
      })
    }
  }
  render() {
    const displayManifestationsList = () => {
      const list = this.state.manifestations.map((m) => {
        return <p key={"title-" + m.manifestation}><span onClick={() => {this.handleChangeManifestation(m.manifestation)}}>{m.manifestationTitle}</span></p>
      })
      return list
    }
    const displayManifestation = () => {
      const manifestation = this.state.manifestations.map((m) => {
        if (m.manifestation.includes(this.state.focusedManifestationSlug)){
          return <Surface3 key={"surface-" + m.manifestation} manifestationid={m.manifestation} annotationsDisplay={this.state.annotationsDisplay}/>
        }
        else{
          return null
        }
      })
      return manifestation

    }

    return (
      <div className={this.props.hidden ? "hidden" : "showing"}>
        <div className="surfaceWrapper">
          <div className="manifestationsList">
            {displayManifestationsList()}
          </div>
          <div className="imagesDisplay">
            {displayManifestation()}
          </div>
          {this.state.focusedManifestationSlug &&
            <div>
            <p><span title="Text Line View" onClick={() => {this.handleToggleTextLinesView("lines")}}><FaList/></span></p>
            <p><span title="Paragraph View" onClick={() => {this.handleToggleTextLinesView("paragraph")}}><FaParagraph/></span></p>
            <p><span title="Full Surface View" onClick={() => {this.handleToggleTextLinesView("surface")}}><FaFile/></span></p>
            </div>
          }

        </div>
      </div>
    );
  }
}

export default Surface3Wrapper;
