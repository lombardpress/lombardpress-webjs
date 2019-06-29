import React from 'react';
import Container from 'react-bootstrap/Container';
import Axios from 'axios'

import Surface3 from './Surface3';

//TODO: surface 3 needs to run in a wrapper which allows the user to choose between manifestations.
//TODO: rdf dbase needs to include first line numbers for paragraphs that start in the middle of al line.

class Surface3Wrapper extends React.Component {
  constructor(props){
    super(props)
    this.handleChangeManifestation = this.handleChangeManifestation.bind(this)
    this.state = {
      manifestations: [],
      focusedManifestation: "",
      focusedManifestationSlug: null,
    }
  }
  handleChangeManifestation(focusedManifestation){
    //TODO not best way to get manifestation slug; it should probably be retrieved from info query
    const slug = focusedManifestation.split("/resource/")[1].split("/")[1]
    this.setState({focusedManifestation: focusedManifestation, focusedManifestationSlug: slug})
  }
  componentDidMount(){
    if (this.props.info){
      this.setState((prevState) => {
        return {
          manifestations: this.props.info.manifestations
        }
      })
    }
  }
  componentWillReceiveProps(nextProps){
    if (nextProps.info != this.props.info){
      this.setState((prevState) => {
        return {
          manifestations: nextProps.info.manifestations
        }
      })
    }
  }
  render() {
    const displayManifestationsList = () => {
      const list = this.state.manifestations.map((m) => {
        return <p key={"title-" + m.manifestation}><a onClick={() => {this.handleChangeManifestation(m.manifestation)}}>{m.manifestationTitle}</a></p>
      })
      return list
    }
    const displayManifestation = () => {
      const manifestation = this.state.manifestations.map((m) => {
        if (m.manifestation.includes(this.state.focusedManifestationSlug)){
          return <Surface3 key={"surface-" + m.manifestation} manifestationid={m.manifestation}/>
        }
      })
      return manifestation

    }

    return (
      <div className={this.props.hidden ? "hidden surfaceWrapper" : "showing surfaceWrapper"}>
        <div className="manifestationsList">
          {displayManifestationsList()}
        </div>
        <div className="imagesDisplay">
          {displayManifestation()}
        </div>
      </div>
    );
  }
}

export default Surface3Wrapper;
