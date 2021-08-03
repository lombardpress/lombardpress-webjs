import React from 'react';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import {FaChevronDown, FaChevronUp} from 'react-icons/fa';
import {Link} from 'react-router-dom';

class ManifestationList extends React.Component {
  constructor(props){
    super(props)
    this.toggleAlternativeManifestations = this.toggleAlternativeManifestations.bind(this)
    this.state = {
      showAlternativeManifestations: true
    }
  }
  toggleAlternativeManifestations(){
    this.setState((prevState) => {
      return {showAlternativeManifestations: !prevState.showAlternativeManifestations}
    })
  }
  render(){
    const wordRange = this.props.selectionRange && this.props.selectionRange.wordRange && 
      this.props.selectionRange.wordRange.start + "-" + this.props.selectionRange.wordRange.end;
    
      const displayManifestations = () => {
      if (this.props.manifestations){
        const manifestations = this.props.manifestations.map((i) => {
          if (this.props.tresourceid.includes(i.manifestation)){
            return (<p key={i.manifestation}>
              {i.manifestationTitle}{wordRange && "@" + wordRange} (Currrent Focus)
            </p>)
          }
          else{
            return (<p key={i.manifestation}>
              <Link to={wordRange ? "/text?resourceid=" + i.manifestation + "@" + wordRange : "/text?resourceid=" + i.manifestation}>
              {i.manifestationTitle}{wordRange && "@" + wordRange}</Link>
            </p>
            )
          }
        })
        return manifestations
      }
    }
    return (
      <Container className="ManifestationList">
      {this.props.optionalDisplay ?
        <h4 onClick={this.toggleAlternativeManifestations}>{this.state.showAlternativeManifestations ? <span><FaChevronDown/>Hide Alternative Manifestations</span> : <span><FaChevronUp/>View Alternative Manifestations</span>} </h4>
        :
        <h4>Available Manifestations</h4>
      }

        {this.state.showAlternativeManifestations && displayManifestations()}
      </Container>
    );
  }
}
ManifestationList.propTypes = {
/**
  * manifestations provides list of other mnaifestations for focused expression

  * TODO: it seems desireable not to require a manifestations property so that
  * one can simply provide the transcription resource id, but if the propery is not
  * the component could look it up itself. But information could also be supplied a prop
  * in the case the parent component already has the information. In this case,
  * a second look up by the component would be needless
  */
  manifestations: PropTypes.array,
  optionalDisplay: PropTypes.bool
}
export default ManifestationList;
