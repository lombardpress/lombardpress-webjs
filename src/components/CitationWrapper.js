import React from 'react';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Citation from './Citation'
import CitationExplanation from './CitationExplanation'
import ManifestationList from './ManifestationList'

function CitationWrapper(props) {
  return (
    <Container className={props.hidden ? "CitationWrapper hidden" : "CitationWrapper showing"}>
      <Citation tresourceid={props.tresourceid}/>
      <CitationExplanation/>
      <hr/>
      <ManifestationList manifestations={props.manifestations} handleFocusChange={props.handleFocusChange}/>
    </Container>
  );
}

Citation.propTypes = {
  /**
  * transcription resource id of focused passage,
  * transcription id is required to be passed down to Citaiton Component
  */
  tresourceid: PropTypes.string.isRequired,
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
  * hidden designates whether the component should be hidden after mounting
  */
  hidden: PropTypes.bool,
  /**
  * function to handle response when new manifestaiton is picked.
  * should be passed down to ManifestationList component
  */
  handleFocusChange: PropTypes.func
}
export default CitationWrapper;
