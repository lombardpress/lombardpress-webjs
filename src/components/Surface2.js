import React from 'react';
import Container from 'react-bootstrap/Container';
import Axios from 'axios'
import Button from 'react-bootstrap/Button';

import ImageTextWrapper from './ImageTextWrapper';

import {runQuery} from './utils'
import {getSurfaceInfo} from './Queries'



class Surface2 extends React.Component {
  constructor(props){
    super(props)
    this.mount = false
    this.handleNext = this.handleNext.bind(this)
    this.handlePrevious = this.handlePrevious.bind(this)
    this.handleLineFocusNext = this.handleLineFocusNext.bind(this)
    this.handleLineFocusPrev = this.handleLineFocusPrev.bind(this)
    this.isLineNumberLast = this.isLineNumberLast.bind(this)
    this.isLineNumberFirst = this.isLineNumberFirst.bind(this)
    this.handleToggleTextLines = this.handleToggleTextLines.bind(this)
    this.handleToggleAllLines = this.handleToggleAllLines.bind(this)
    this.state = {
      currentSurfaceId: "",
      manifest: "",
      canvas: "",
      region: "full",
      width: "1000",
      next: "",
      previous: "",
      imageurl: "",
      annotationsDisplay: true,
      showAllLines: false
    }

  }
  handleNext(){
    //this.retrieveSurfaceInfo(this.state.next)
    this.props.handleSurfaceFocusChange(this.state.next)
  }
  handlePrevious(){
    //this.retrieveSurfaceInfo(this.state.previous)
    this.props.handleSurfaceFocusChange(this.state.previous)

  }
  handleToggleTextLines(){
    //this.retrieveSurfaceInfo(this.state.previous)
    this.setState((prevState) => {
      return {annotationsDisplay: !prevState.annotationsDisplay}
    })
  }
  handleToggleAllLines(){
    this.setState((prevState) => {
      return {showAllLines: !prevState.showAllLines}
    })
  }
  retrieveSurfaceInfo(surfaceid){
    // manifest id should be retrieved from query
    // this is a temporary measure until db is corrected and query is posible

    //const manifest = "http://scta.info/iiif/" + this.props.topLevel.split("/resource/")[1] + "/" + surfaceid.split("/resource/")[1].split("/")[0] + "/manifest";
    const manifest = "";
    const surfaceInfo = runQuery(getSurfaceInfo(surfaceid))
    surfaceInfo.then((d) => {
      const b = d.data.results.bindings[0]
      // only preceed if sparql query returns results
      if (b){
        //second nested async call for annotation list
        const alUrl = "https://exist.scta.info/exist/apps/scta-app/folio-annotaiton-list-from-simpleXmlCoordinates.xq?surfaceid=" + surfaceid.split("/resource/")[1]
        Axios.get(alUrl).then((d2) => {
          if (this.mount){
              this.setState({
                currentSurfaceId: surfaceid,
                surfaceTitle: b.surfaceTitle.value,
                manifest: manifest,
                canvas: b.canvas.value,
                imageurl: b.imageurl.value,
                next: b.next_surface ? b.next_surface.value : "",
                previous: b.previous_surface ? b.previous_surface.value : "",
                annotations: d2.data ? d2.data.resources : ""
            })
          }
        }).catch((error) => {
          console.log("failed retrieving annotationlist: ", error)
          if (this.mount){
            this.setState({
            currentSurfaceId: surfaceid,
            surfaceTitle: b.surfaceTitle.value,
            manifest: manifest,
            canvas: b.canvas.value,
            imageurl: b.imageurl.value,
            next: b.next_surface ? b.next_surface.value : "",
            previous: b.previous_surface ? b.previous_surface.value : "",
            annotations: ""
          })
        }
      })
    }
  })
}
// next for functions are used to compute next and previous Lines
// this is a little bit hacky, since there are no resources for lines yet.
// thus the line id is computed by breaking the line id apart,
// using the line number to compute the next and the reassembling the line RDF id.
// this will become unnecessary if/when each lines become and RDF resource and contains a next previous property
handleLineFocusNext() {
  const currentLineNumber = parseInt(this.props.lineFocusId.split("/")[this.props.lineFocusId.split("/").length - 1])
  const newLineArray = this.props.lineFocusId.split("/")
  newLineArray.pop()
  newLineArray.push((currentLineNumber + 1).toString())
  this.props.handleLineFocusChange(newLineArray.join("/"))
}
handleLineFocusPrev(){
  const currentLineNumber = parseInt(this.props.lineFocusId.split("/")[this.props.lineFocusId.split("/").length - 1])
  const previousLineArray = this.props.lineFocusId.split("/")
  previousLineArray.pop()
  previousLineArray.push((currentLineNumber - 1).toString())
  this.props.handleLineFocusChange(previousLineArray.join("/"))
}
isLineNumberFirst(){
  const lineNumber = parseInt(this.props.lineFocusId.split("/")[this.props.lineFocusId.split("/").length - 1])

  if (lineNumber === 1){
    return true
  }
  else {
    return false
  }
}
isLineNumberLast(){
  const total = this.state.annotations.length
  const lineNumber = parseInt(this.props.lineFocusId.split("/")[this.props.lineFocusId.split("/").length - 1])
  if (lineNumber === total){
    return true
  }
  else{
    return false
  }
}
componentDidMount(){
  this.mount = true
    if (this.props.surfaceid){
      this.retrieveSurfaceInfo(this.props.surfaceid)
    }
    this.setState({annotationsDisplay: this.props.annotationsDisplay})
  }
  componentWillReceiveProps(nextProps){
    if (nextProps.surfaceid !== this.props.surfaceid){
    this.retrieveSurfaceInfo(nextProps.surfaceid)
    }
  }
  componentWillUnmount(){
    this.mount = false
  }

  render() {

    const diplayLinePrev = () => {
    }
    const displayImages = () => {
      if (this.state.annotations && this.state.annotationsDisplay){
        const imageTextWrappers = this.state.annotations.map((h, i) => {
          const text = h.resource.chars;
          const canvas = h.on.split("#xywh=")[0];
          const canvasShort = canvas.split("/")[canvas.split("/").length - 1];
          const coords = h.on.split("#xywh=")[1];
          const imageUrl = h.imageUrl
          const label = h.label
          if (this.state.showAllLines || (parseInt(this.props.lineFocusId.split("/")[this.props.lineFocusId.split("/").length - 1]) === (i + 1) ) || !this.props.lineFocusId){
          return (
            <ImageTextWrapper key={i}
              imageUrl={imageUrl}
              canvas={canvas}
              coords={coords}
              canvasShort={canvasShort}
              text={text}
              label={label}
              number={i}
              targetLabel={this.props.targetLabel}
              surfaceButton={false}
              displayWidth={this.props.width ? this.props.width : this.state.width}
              />
            )
          }
          else{
            return null
          }

        })
        return imageTextWrappers
      }
      else{
        const width = this.props.width ? this.props.width : this.state.width
        return <img alt="manuscript" src={this.state.imageurl + "/" + this.state.region + "/" + width + ",/0/default.jpg"}/>
      }
    }
    return (
      <Container className={this.props.hidden ? "hidden" : "showing"}>
      {this.state.currentSurfaceId ?
        <div>
          <div className="surface-navigation">
            <p>{this.state.surfaceTitle}</p>
            {(this.props.handleSurfaceFocusChange) &&
              <div>
              {this.state.previous && <Button size="sm" onClick={this.handlePrevious}>Previous Page</Button>}
              {this.state.next && <Button size="sm" onClick={this.handleNext}>Next Page</Button>}
              </div>
            }
            {(this.props.handleLineFocusChange && !this.state.showAllLines) &&
              <div>
              {!this.isLineNumberFirst() && <Button size="sm" onClick={this.handleLineFocusPrev}>Previous Line</Button>}
              {!this.isLineNumberLast() && <Button size="sm" onClick={this.handleLineFocusNext}>Next Line</Button>}
              </div>
            }
            <div>

            {this.props.lineFocusId && <Button size="sm" onClick={this.handleToggleAllLines}>Toggle All/Focus Lines</Button>}
            {(this.state.annotations) && <Button size="sm" onClick={this.handleToggleTextLines}>Toggle Show Text Lines</Button>}
            </div>
          </div>
          {displayImages()}
        </div> : <p>No surface selected</p>}
      </Container>

    );
  }

}
Surface2.defaultProps = {
  annotationsDisplay: true
};
export default Surface2;
