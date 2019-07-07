import React from 'react';
import Container from 'react-bootstrap/Container';
import Axios from 'axios'

import ImageTextWrapper from './ImageTextWrapper';

import {runQuery} from './utils'
import {getSurfaceInfo} from './Queries'



class Surface2 extends React.Component {
  constructor(props){
    super(props)
    this.handleNext = this.handleNext.bind(this)
    this.handlePrevious = this.handlePrevious.bind(this)
    this.handleToggleTextLines = this.handleToggleTextLines.bind(this)
    this.state = {
      currentSurfaceId: "",
      manifest: "",
      canvas: "",
      region: "full",
      width: "1000",
      next: "",
      previous: "",
      imageurl: "",
      annotationsDisplay: true
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
  retrieveSurfaceInfo(surfaceid){
    console.log('surfaceid', surfaceid)
    // manifest id should be retrieved from query
    // this is a temporary measure until db is corrected and query is posible

    const manifest = "http://scta.info/iiif/" + this.props.topLevel.split("/resource/")[1] + "/" + surfaceid.split("/resource/")[1].split("/")[0] + "/manifest";
    const surfaceInfo = runQuery(getSurfaceInfo(surfaceid))
    surfaceInfo.then((d) => {
      const b = d.data.results.bindings[0]
      //second nested async call for annotation list
      const alUrl = "https://exist.scta.info/exist/apps/scta-app/folio-annotaiton-list-from-simpleXmlCoordinates.xq?surfaceid=" + surfaceid.split("/resource/")[1]
      Axios.get(alUrl).then((d2) => {
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
      }).catch((error) => {
        console.log("failed retrieving annotationlist: ", error)
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
    })
  })
}
componentDidMount(){
    if (this.props.surfaceid){
      console.log('surfaceid', this.props.surfaceid)
      this.retrieveSurfaceInfo(this.props.surfaceid)
    }
  }
  componentWillReceiveProps(nextProps){
    if (nextProps.surfaceid){
    this.retrieveSurfaceInfo(nextProps.surfaceid)
    }
  }
  render() {
    const displayImages = () => {
      if (this.state.annotations && this.state.annotationsDisplay){
        const imageTextWrappers = this.state.annotations.map((h, i) => {
          const text = h.resource.chars;
          const canvas = h.on.split("#xywh=")[0];
          const canvasShort = canvas.split("/")[canvas.split("/").length - 1];
          const coords = h.on.split("#xywh=")[1];
          const imageUrl = h.imageUrl
          const label = h.label
          return (
            <ImageTextWrapper key={i}
              imageUrl={imageUrl}
              canvas={canvas}
              coords={coords}
              canvasShort={canvasShort}
              text={text}
              label={label}
              targetLabel={this.props.targetLabel}
              surfaceButton={false}
              displayWidth="1000"
              />
            )

        })
        return imageTextWrappers
      }
      else{
        return <img alt="manuscript" src={this.state.imageurl + "/" + this.state.region + "/" + this.state.width + ",/0/default.jpg"}/>
      }
    }
    return (
      <Container className={this.props.hidden ? "hidden" : "showing"}>
      {this.state.currentSurfaceId ?
        <div>
          <div className="surface-navigation">
            <p>{this.state.surfaceTitle}</p>
            {this.state.previous && <p><button onClick={this.handlePrevious}>Previous</button></p>}
            {this.state.next && <p><button onClick={this.handleNext}>Next</button></p>}
            {this.state.annotations && <p><button onClick={this.handleToggleTextLines}>Toggle Text Lines</button></p>}
          </div>
          {displayImages()}
        </div> : <p>No surface selected</p>}
      </Container>

    );
  }

}

export default Surface2;
