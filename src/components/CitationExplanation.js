import React from 'react';
import Container from 'react-bootstrap/Container';
import {FaChevronDown, FaChevronUp} from 'react-icons/fa';

class CitationExplanation extends React.Component {
  constructor(props){
    super(props)
    this.toggleCitationExplanation = this.toggleCitationExplanation.bind(this)
    this.state = {
      showCitationExplanation: false,
    }
  }
  toggleCitationExplanation(){
    this.setState((prevState) => {
      return {showCitationExplanation: !prevState.showCitationExplanation}
    })
  }
  render(){
    return (
      <Container className="ManifestationList">
      <h4 onClick={this.toggleCitationExplanation}>{this.state.showCitationExplanation ? <span><FaChevronDown/>Hide Explanation of Citation Practices</span> : <span><FaChevronUp/>View Explanation of Citation Practices</span>} </h4>
      {this.state.showCitationExplanation &&
        <div>
          <p>The citation of a text that has survived through a historical succession of manifestations is a complicated endeavor.
          Today, when transcriptions of these manifestations
          can be published as data, separate from any presentation,
          and thereby can be presented in a variety of ways,
          a full citation inevitably becomes even more complex.
          In order to identify the content hierarchy of the text,
          the specifical material or born digital manifestation of that text,
          and the data sources used to represent and display that manifestation,
          specificity and precision are needed.</p>

          <p>Full citations therefore identify three aspects of the text currently being viewed.</p>

          <p className="etitle">First (blue) it identifies the idea of the paragraph in question situated within the conceptual hierarchy of the text.</p>

          <p className="mtitle">Second (red) it identifies the manifestation of the text in a historical or born digital edition.</p>

          <p className="ttitle">Third (purple) it identifies the transcription and transcription data source used to power the current text presentation.</p>
        </div>}
      </Container>

    );
  }
}

export default CitationExplanation;
