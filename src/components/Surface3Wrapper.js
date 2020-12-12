import React from 'react';
import Surface3 from './Surface3';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import { FaList, FaFile, FaParagraph} from 'react-icons/fa';

import {runQuery} from './utils'
import {basicInfoQuery} from './Queries'

//TODO: surface 3 needs to run in a wrapper which allows the user to choose between manifestations.
//TODO: rdf dbase needs to include first line numbers for paragraphs that start in the middle of al line.

class Surface3Wrapper extends React.Component {
  constructor(props){
    super(props)
    this.handleChangeManifestation = this.handleChangeManifestation.bind(this)
    this.handleToggleTextLinesView = this.handleToggleTextLinesView.bind(this)
    this.handleSetCustomExpressionId = this.handleSetCustomExpressionId.bind(this)
    this.handleGetCustomManifestations = this.handleGetCustomManifestations.bind(this)
    this.handleChangeCustomManifestation = this.handleChangeCustomManifestation.bind(this)
    this.state = {
      focusedManifestation: "",
      annotationsDisplay: "lines",
      userAddedExpressionId: "",
      userAddedManifestations: [],
      focusedCustomManifestation: ""
    }
  }
  handleChangeCustomManifestation(value){
    this.setState({focusedCustomManifestation: value})
  }
  handleSetCustomExpressionId(value){
    this.setState({userAddedExpressionId: value})
  }
  handleGetCustomManifestations(e){
    e.preventDefault()
    const results = runQuery(basicInfoQuery(this.state.userAddedExpressionId))
    results.then((d) => {
      const manifestations = d.data.results.bindings.map((b) => {
        return {
          manifestation: b.manifestation.value,
          manifestationTitle: b.manifestationTitle.value,
          transcription: b.manifestationCTranscription ? b.manifestationCTranscription.value : ""
        }
      })
      this.setState({userAddedManifestations: manifestations, focusedCustomManifestation: d.data.results.bindings[0].cmanifestation.value})
    })
     

  }

  handleToggleTextLinesView(view){
    //optional prop to allow parent container to reset default view prop
    if (this.props.handleToggleTextLinesView){
      this.props.handleToggleTextLinesView(view)
    }
    else{
      this.setState((prevState) => {
        return {annotationsDisplay: view}
      })
    }
  }
  handleChangeManifestation(e){
    e.preventDefault()
    //optional prop to allow parent container to reset default view prop
    if (this.props.handleChangeManifestation){
      this.props.handleChangeManifestation(e.target.value)
    }
    else{
      this.setState({focusedManifestation: e.target.value})
    }
  }
  componentDidMount(){
    if (this.props.manifestations){
      this.setState((prevState) => {
        return {
          focusedManifestation: this.props.focusedManifestation,
          annotationsDisplay: this.props.annotationsDisplay,
        }
      })
    }
  }
  // UNSAFE_componentWillReceiveProps(nextProps){
  //   if (nextProps.focusedManifestation !== this.props.focusedManifestation){
  //     this.setState((prevState) => {
  //       return {
  //         focusedManifestation: nextProps.focusedManifestation,
  //       }
  //     })
  //   }
  //   if (nextProps.annotationsDisplay !== this.props.annotationsDisplay){
  //     this.setState((prevState) => {
  //       return {
  //         annotationsDisplay: nextProps.annotationsDisplay,
  //       }
  //     })
  //   }
  // }

  //TODO: is passing of props to state necessary? settingDerivedState is not ideal
  //thus there should be a good reason for setting a derived state. 
  // the goal here is to allow the component to update the state, but for 
  // the parent component to determine the default state. 
  // unless there is another way to do this, this seems like a sufficient justification for the derived state.
  componentDidUpdate(prevProps){
    if (this.props.focusedManifestation !== prevProps.focusedManifestation){
      this.setState((prevState) => {
        return {
          focusedManifestation: this.props.focusedManifestation,
        }
      })
    }
    if (this.props.annotationsDisplay !== prevProps.annotationsDisplay){
      this.setState((prevState) => {
        return {
          annotationsDisplay: this.props.annotationsDisplay,
        }
      })
    }
  }
  render() {
    const displayManifestationsList = () => {
      const list = this.props.manifestations.map((m) => {
        return <option key={"title-" + m.manifestation} value={m.manifestation}>{m.manifestationTitle}</option>
      })
      return list
    }
    const displayManifestation = () => {
      const manifestation = this.props.manifestations.map((m) => {
        if (m.manifestation === this.state.focusedManifestation){
          return <Surface3 key={"surface-" + m.manifestation} 
          manifestationid={m.manifestation} 
          annotationsDisplay={this.state.annotationsDisplay} 
          width={this.props.width}
          lineFocusId={this.props.lineFocusId}/>
        }
        else{
          return null
        }
      })
      return manifestation

    }

    return (
      <div className={this.props.hidden ? "hidden" : "showing"}>
        {!this.props.hideSelectionList &&
        <div className="manifestationsList">
          <Form.Control size="sm" as="select" onChange={this.handleChangeManifestation} value={this.state.focusedManifestation}>
            {displayManifestationsList()}
          </Form.Control>
        </div>
        }
        <div className="surfaceWrapper">
          {!this.props.hideDisplayChoice && this.state.focusedManifestation &&
            <div className="image-display-choice">
              <p><span title="Text Line View" onClick={() => {this.handleToggleTextLinesView("lines")}}><FaList/></span></p>
              <p><span title="Paragraph View" onClick={() => {this.handleToggleTextLinesView("paragraph")}}><FaParagraph/></span></p>
              <p><span title="Full Surface View" onClick={() => {this.handleToggleTextLinesView("surface")}}><FaFile/></span></p>
            </div>
          }
          <div className="imagesDisplay">
            {displayManifestation()}
          </div>
        </div>
        
        {
          this.state.userAddedManifestations.length > 0 && 
          <Surface3Wrapper 
            manifestations={this.state.userAddedManifestations}
            focusedManifestation={this.state.focusedCustomManifestation}
            annotationsDisplay={this.state.annotationsDisplay}
            handleToggleTextLinesView={this.props.handleToggleTextLinesView}
            handleChangeManifestation={this.handleChangeCustomManifestation}
            width={this.props.width}
            lineFocusId={""}
            hidden={false}
            isDependentSurface3={true}/>
        }
        {!this.props.isDependentSurface3 &&
        <div style={{"borderBottom": "1px solid rgba(0, 0, 0, 0.1)", "borderTop": "1px solid rgba(0, 0, 0, 0.1)", marginTop: "5px", padding: "5px"}} >
          <p style={{fontSize: "12px"}}>Create custom user compare</p>
          <Form onSubmit={this.handleGetCustomManifestations} inline> 
            <FormControl inline="true" size="sm" id="text" type="text" value={this.state.userAddedExpressionId} placeholder="expression id" className="mr-sm-2" onChange={(e) => {this.handleSetCustomExpressionId(e.target.value)}}/>
            <Button inline="true" size="sm"  type="submit" style={{margin: "2px"}}>Submit</Button>
          </Form>
        </div>
        }

      </div>
    );
  }
}

Surface3Wrapper.defaultProps = {
  manifestations: [],
  hidden: false,
  focusedManifestation: "",
  annotationsDisplay: "paragraph",
  width: "500"
};

Surface3Wrapper.propTypes = {
  /**
  * an array of manifestation ids
  */
  manifestations: PropTypes.array,
  /**
  * boolean indicating whether or not compoment should be mounted by still hidden
  */
  hidden: PropTypes.bool,
  /**
  * indicates on which manifestation component to default focus.
  * manifestation value MUST be included in manifestations array
  */
  focusedManifestation: PropTypes.string,
  /**
  * indicates what kind of display is desired, "lines, paragraph, surface/null"
  */

  annotationsDisplay: PropTypes.string,
  /**
  * optional prop to allow parent container to reset default view prop
  */
  handleToggleTextLinesView: PropTypes.func,
  /**
  * desired image width
  */
  width: PropTypes.string
}

export default Surface3Wrapper;
