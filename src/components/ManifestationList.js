import React from 'react';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Citation from './Citation'
import {FaChevronDown, FaChevronUp} from 'react-icons/fa';

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
    const displayManifestations = () => {
      if (this.props.manifestations){
        const manifestations = this.props.manifestations.map((i) => {
          return <p key={i.manifestation}>{i.manifestationTitle} : <span className="lbp-span-link" onClick={() => {this.props.handleFocusChange(i.manifestation)}}>{i.manifestation}</span></p>
        })
        return manifestations
      }
    }
    return (
      <Container className="ManifestationList">
      {this.props.optionalDisplay ?
        <h4 onClick={this.toggleAlternativeManifestations}>{this.state.showAlternativeManifestations ? <span><FaChevronDown/>Hide Alternative Manifestations</span> : <span><FaChevronUp/>View Alternative Manifestations</span>} </h4>
        :
        <h4>Alternative Manifestations</h4>
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
  /**
  * function to handle response when new manifestaiton is picked.
  *
  */
  handleFocusChange: PropTypes.func,
  /**
  * boolean; if true; turns manifestation header into trigger to hide and display manifestation list
  */
  optionalDisplay: PropTypes.bool
}
export default ManifestationList;
