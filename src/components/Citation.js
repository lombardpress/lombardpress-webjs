import React from 'react';
import Container from 'react-bootstrap/Container';
import {Link} from 'react-router-dom';
import { FaClipboard} from 'react-icons/fa';
import {runQuery, copyToClipboard} from './utils'
import {getManifestationCitationInfo} from './Queries'

class Citation extends React.Component{
  constructor(props){
    super(props)
    this.toggleAlternativeManifestations = this.toggleAlternativeManifestations.bind(this)
    this.toggleCitationExplanation = this.toggleCitationExplanation.bind(this)
    this.state = {
      eurl: "",
      etitle: "",
      murl: "",
      mtitle: "",
      turl: "",
      showAlternativeManifestations: false,
      showCitationExplanation: false
    }
  }
  toggleAlternativeManifestations(){
    this.setState((prevState) => {
      return {showAlternativeManifestations: !prevState.showAlternativeManifestations}
    })
  }
  toggleCitationExplanation(){
    this.setState((prevState) => {
      return {showCitationExplanation: !prevState.showCitationExplanation}
    })
  }

  retrieveCitation(info, mtFocus){
    if (mtFocus){
      const transcriptionid = info.resourceid + mtFocus
      const manifestationCitationInfo = runQuery(getManifestationCitationInfo(transcriptionid))
      manifestationCitationInfo.then((data) => {
        const allBindings = data.data.results.bindings
        const bindings = allBindings[0]
        const manifestationid = bindings.manifestation ? bindings.manifestation.value : ""
        const datasource = bindings.datasource ? bindings.datasource.value : ""
        const title = bindings.codexTitle ? bindings.codexTitle.value : ""
        const start = bindings.surfaceTitle ? bindings.surfaceTitle.value : ""
        const end = allBindings[allBindings.length - 1].surfaceTitle ? allBindings[allBindings.length - 1].surfaceTitle.value : ""

        this.setState(
          {
            author: info.author,
            authorTitle: info.authorTitle,
            eurl: info.resourceid,
            etitle: info.longTitle,
            murl: manifestationid,
            mtitle: start !== end ? title + ", " + start + "-" + end : title + ", " + start,
            turl: transcriptionid,
            datasource: datasource,
          }
        )
      })
    }
  }
  componentDidMount(){
    this.retrieveCitation(this.props.info, this.props.mtFocus)

  }
  componentWillReceiveProps(newProps){
    if (newProps.info !== this.props.info || newProps.mtFocus !== this.props.mtFocus){
      this.retrieveCitation(newProps.info, newProps.mtFocus)
    }
  }
  render(){
    const displayManifestations = () => {
      if (this.props.info){
        const manifestations = this.props.info.manifestations.map((i) => {
          return <p key={i.manifestation}>{i.manifestationTitle} : <Link to={"/text?resourceid=" + i.manifestation}>{i.manifestation}</Link></p>
        })
        return manifestations
      }
    }
    const fullCitationString = this.state.authorTitle + ", " + this.state.etitle + "(" + this.state.mtitle + ") Data source: " + this.state.datasource + "."
    return (
      <Container className={this.props.hidden ? "hidden" : "showing"}>
      <h4>Citation</h4>
      <p>
        <span className="etitle">{this.state.authorTitle}, {this.state.etitle} (<a href={this.state.eurl} target="_blank" rel="noopener noreferrer">{this.state.eurl}</a>)</span>
        <br/>
        <span className="mtitle">({this.state.mtitle} (<a href={this.state.murl} target="_blank" rel="noopener noreferrer">{this.state.murl}</a>))</span>
        <br/>
        <span className="ttitle">(Transcription Resource: <a href={this.state.turl} target="_blank" rel="noopener noreferrer">{this.state.turl}</a>;
        (Data source:<a href={this.state.datasource} target="_blank" rel="noopener noreferrer"> {this.state.datasource}</a>)</span>
        <span title="Copy Citation to Clipboard" onClick={(e) => {e.preventDefault(); copyToClipboard(fullCitationString)}}><FaClipboard /></span>
      </p>
      <div className="citation-manifestation-options">
        <h4 onClick={this.toggleAlternativeManifestations}>{this.state.showAlternativeManifestations ? "Hide " : "View "} the same text in an alternative manifestation</h4>
        {this.state.showAlternativeManifestations && displayManifestations()}
      </div>
      {/*
       Peter Plaoul, Commentarius in libros Sententiarum, de Fide, Lectio 1, de Fide, Quaestio: utrum in causa iudiciali fidei contra traditionem pure humanitus adinventam iudex idoneus ferret pro fide sententiam , Paragraph l1-cpspfs, [n. 1], SCTA Expression Url http://scta.info/resource/l1-cpspfs; ed. EditorName, SCTA Manifestion Url http://scta.info/resource/l1-cpspfs, Transcription Data Source QmNynYEQkRrt6MTfCxS8w2Pm6eN4tbLXuRCpE7HbzWdxqg; Accessed at http://scta.lombardpress.org/text/l1-cpspfs on June 29, 2019, Archived at http://scta.lombardpress.org/text/archive?datasource=QmNynYEQkRrt6MTfCxS8w2Pm6eN4tbLXuRCpE7HbzWdxqg</p>

       <p>Short Citation</p>

       <p>Peter Plaoul, Commentarius in libros Sententiarum, de Fide, Lectio 1, de Fide, Quaestio: utrum in causa iudiciali fidei contra traditionem pure humanitus adinventam iudex idoneus ferret pro fide sententiam , Paragraph l1-cpspfs, [n. 1], QmNynYEQkRrt6MTfCxS8w2Pm6eN4tbLXuRCpE7HbzWdxqg, Accessed on June 29, 2019</p>
       */}
<div>
  <h4 onClick={this.toggleCitationExplanation}>{this.state.showCitationExplanation ? "Hide " : "View "} explanation of citation practices</h4>
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
  </div>
  </Container>
    );
  }
}

export default Citation;
