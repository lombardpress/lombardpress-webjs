import React from 'react';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Spinner from './Spinner';
import { FaClipboard} from 'react-icons/fa';
import {runQuery, copyToClipboard} from './utils'
import {getManifestationCitationInfo} from './Queries'

/**
* citation component
*
* TODO: it would be better to separate the citation display, manifestation picker, citation explation
* into three differen compoments wrapped in a citation Wrapper.
* This way the citation display could be truly independent
*/
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
      showCitationExplanation: false,
      fetching: false
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

  retrieveCitation(tresourceid){
    if (tresourceid){
      this.setState({fetching: true})
      const manifestationCitationInfo = runQuery(getManifestationCitationInfo(tresourceid))
      manifestationCitationInfo.then((data) => {
        const allBindings = data.data.results.bindings
        if (allBindings.length > 0){
          const bindings = allBindings[0]
          const expressionid = bindings.expression ? bindings.expression.value : ""
          const manifestationid = bindings.manifestation ? bindings.manifestation.value : ""
          const eLongTitle = bindings.eLongTitle ? bindings.eLongTitle.value : ""
          const authorTitle = bindings.authorTitle ? bindings.authorTitle.value : ""
          const author = bindings.authorTitle ? bindings.author.value : ""
          const datasource = bindings.datasource ? bindings.datasource.value : ""
          const title = bindings.codexTitle ? bindings.codexTitle.value : ""
          const start = bindings.surfaceTitle ? bindings.surfaceTitle.value : ""
          const end = allBindings[allBindings.length - 1].surfaceTitle ? allBindings[allBindings.length - 1].surfaceTitle.value : ""

          this.setState(
            {
              author: author,
              authorTitle: authorTitle,
              eurl: expressionid,
              etitle: eLongTitle,
              murl: manifestationid,
              mtitle: start !== end ? title + ", " + start + "-" + end : title + ", " + start,
              turl: tresourceid,
              datasource: datasource,
              fetching: false
            }
          )
        }
      })
    }
  }
  componentDidMount(){
    this.retrieveCitation(this.props.tresourceid)

  }
  componentWillReceiveProps(newProps){
    if (newProps.tresourceid !== this.props.tresourceid){
      this.retrieveCitation(newProps.tresourceid)
    }
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
    const fullCitationString = this.state.authorTitle + ", " + this.state.etitle + "(" + this.state.mtitle + ") Data source: " + this.state.datasource + "."
    return (
      <Container className={this.props.hidden ? "hidden" : "showing"}>
      <h4>Citation</h4>
      {this.state.fetching ?
        <Spinner/> :
      <div>
        <p className="etitle">{this.state.authorTitle}, {this.state.etitle} (<a href={this.state.eurl} target="_blank" rel="noopener noreferrer">{this.state.eurl}</a> <span className="lbp-span-link" title="Copy Citation to Clipboard" onClick={(e) => {e.preventDefault(); copyToClipboard(this.state.eurl)}}><FaClipboard /></span>)</p>

        <p className="mtitle">({this.state.mtitle} (<a href={this.state.murl} target="_blank" rel="noopener noreferrer">{this.state.murl}</a> <span className="lbp-span-link" title="Copy Citation to Clipboard" onClick={(e) => {e.preventDefault(); copyToClipboard(this.state.murl)}}><FaClipboard /></span>))</p>

        <p className="ttitle">(Transcription Resource: <a href={this.state.turl} target="_blank" rel="noopener noreferrer">{this.state.turl}</a> <span className="lbp-span-link" title="Copy Citation to Clipboard" onClick={(e) => {e.preventDefault(); copyToClipboard(this.state.turl)}}><FaClipboard /></span>;
        (Data source:<a href={this.state.datasource} target="_blank" rel="noopener noreferrer"> {this.state.datasource}</a> <span className="lbp-span-link" title="Copy Citation to Clipboard" onClick={(e) => {e.preventDefault(); copyToClipboard(this.state.datasource)}}><FaClipboard /></span>)</p>
        <p className="lbp-span-link" title="Copy Citation to Clipboard" onClick={(e) => {e.preventDefault(); copyToClipboard(fullCitationString)}}><FaClipboard /> Copy Full Citaiton to Clipboard</p>
      </div>
      }
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

Citation.propTypes = {
  /**
  * transcription resource id of focused passage,
  * transcription id is required, because a specific text passage is being complicated
  *
  * TODO: perhaps it would be good to allow the expression or manifestation id to be given
  * but the citation component would need to know what kind of resource this and would
  * need to produce a different query in each case
  */
  tresourceid: PropTypes.string.isRequired,
  /**
  * manifestations provides list of other mnaifestations for focused expression

  * TODO: it seems desireable not to require a manifestations property so that
  * one can simply provide the transcription resource id, but if the propery is not
  * the component could look it up itself. But information could also be supplied a prop
  * in the case the parent component already has the information. In this case,
  * a second look up by the component would be needless

  * TODO: else if this were really going to be separate; the use of link in displayManifestations
  * would need to be changed to prop that expects a function that would know what do with
  * the manifestations change. At present the use of Link makes the component platoform dependent.
  * But this only applies when a "manifestations" prop is supplied. Not supplying manifestations
  * will disable this.

  */
  manifestations: PropTypes.array,
  /**
  * hidden designates whether the component should be hidden after mounting
  */
  hidden: PropTypes.bool,
  /**
  * function to handle response when new manifestaiton is picked.
  *
  * TODO: if manifetation list and selection were separated out into its component,
  * this function would go with the manifestation list component.
  */
  handleFocusChange: PropTypes.func
}

export default Citation;
