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
      focusedManifestation: ""
    }
  }
  handleChangeManifestation(focusedManifestation){
    this.setState({focusedManifestation: focusedManifestation})
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
        return <a onClick={() => {this.handleChangeManifestation(m.manifestation)}}>{m.manifestationTitle}</a>
      })
      return list
    }
    const displayManifestation = () => {
      const manifestation = this.state.manifestations.map((m) => {
        if (m.manifestation === this.state.focusedManifestation){
          return <Surface3 manifestationid={m.manifestation}/>
        }
      })
      return manifestation

    }

    return (
      <Container className={this.props.hidden ? "hidden" : "showing"}>
        {displayManifestationsList()}
        {displayManifestation()}
      </Container>
    );
  }
}

export default Surface3Wrapper;
