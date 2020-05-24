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
    this.mounted = ""
    this.state = {
      eurl: "",
      etitle: "",
      murl: "",
      mtitle: "",
      turl: "",

      fetching: false
    }
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
          if (this.mounted){
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
        }
      })
    }
  }
  componentDidMount(){
    this.mounted = true
    this.retrieveCitation(this.props.tresourceid)

  }
  // UNSAFE_componentWillReceiveProps(newProps){
  //   if (newProps.tresourceid !== this.props.tresourceid){
  //     this.retrieveCitation(newProps.tresourceid)
  //   }
  // }
  componentDidUpdate(prevProps){
    if (this.props.tresourceid !== prevProps.tresourceid){
      this.retrieveCitation(this.props.tresourceid)
    }
  }
  componentWillUnmount(){
    this.mounted = false
  }
  render(){

    const fullCitationString = this.state.authorTitle + ", " + this.state.etitle + "(" + this.state.mtitle + ") Data source: " + this.state.datasource + "."
    return (
      <Container>
      <h4>Citation</h4>
      {this.state.fetching ?
        <Spinner/> :
      <div>
        <p className="etitle">{this.state.authorTitle}, {this.state.etitle} (<a href={this.state.eurl} target="_blank" rel="noopener noreferrer">{this.state.eurl}</a> <span className="lbp-span-link" title="Copy Citation to Clipboard" onClick={(e) => {e.preventDefault(); copyToClipboard(this.state.eurl)}}><FaClipboard /></span>)</p>

        <p className="mtitle">({this.state.mtitle} (<a href={this.state.murl} target="_blank" rel="noopener noreferrer">{this.state.murl}</a> <span className="lbp-span-link" title="Copy Citation to Clipboard" onClick={(e) => {e.preventDefault(); copyToClipboard(this.state.murl)}}><FaClipboard /></span>))</p>

        <p className="ttitle">(Transcription Resource: <a href={this.state.turl} target="_blank" rel="noopener noreferrer">{this.state.turl}</a> <span className="lbp-span-link" title="Copy Citation to Clipboard" onClick={(e) => {e.preventDefault(); copyToClipboard(this.state.turl)}}><FaClipboard /></span>;
        (Data source:<a href={this.state.datasource} target="_blank" rel="noopener noreferrer"> {this.state.datasource}</a> <span className="lbp-span-link" title="Copy Citation to Clipboard" onClick={(e) => {e.preventDefault(); copyToClipboard(this.state.datasource)}}><FaClipboard /></span>)</p>
        <p className="lbp-span-link" title="Copy Citation to Clipboard" onClick={(e) => {e.preventDefault(); copyToClipboard(fullCitationString)}}><FaClipboard /> Copy Full Citation to Clipboard</p>
      </div>
      }
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

}

export default Citation;
