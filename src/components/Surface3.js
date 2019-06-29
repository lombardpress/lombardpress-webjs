import React from 'react';
import Container from 'react-bootstrap/Container';
import Axios from 'axios'

import ImageTextWrapper from './ImageTextWrapper';

import {runQuery} from './utils'
import {getSurfaceInfo, getBlockLines} from './Queries'

//TODO: surface 3 needs to run in a wrapper which allows the user to choose between manifestations.
//TODO: rdf dbase needs to include first line numbers for paragraphs that start in the middle of al line.

class Surface3 extends React.Component {
  constructor(props){
    super(props)
    this.handleNext = this.handleNext.bind(this)
    this.handlePrevious = this.handlePrevious.bind(this)
    this.handleToggleTextLinesView = this.handleToggleTextLinesView.bind(this)
    this.state = {
      annotationsDisplay: "lines",
      width: "1000",
      region: "full",
      surfaces: [
      ]
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
  handleToggleTextLinesView(view){
    //this.retrieveSurfaceInfo(this.state.previous)
    this.setState((prevState) => {
      return {annotationsDisplay: view}
    })
  }
  retrieveSurfaceInfo(manifestationid){
    // manifest id should be retrieved from query
    // this is a temporary measure until db is corrected and query is posible
    const blockLineInfo = runQuery(getBlockLines(manifestationid))
    blockLineInfo.then((d1) => {
      console.log("line data", d1)
      d1.data.results.bindings.forEach((z) => {
      const surfaceid = z.surface.value
      const firstLine = z.first.value
      const lastLine = z.last.value
      const order = z.order.value
      console.log('surfaceid', surfaceid)
      //const manifest = "http://scta.info/iiif/" + this.props.topLevel.split("/resource/")[1] + "/" + surfaceid.split("/resource/")[1].split("/")[0] + "/" + "manifest";
      const surfaceInfo = runQuery(getSurfaceInfo(surfaceid))
      surfaceInfo.then((d) => {
        const b = d.data.results.bindings[0]
        //second nested async call for annotation list
        const alUrl = "https://exist.scta.info/exist/apps/scta-app/folio-annotaiton-list-from-simpleXmlCoordinates.xq?surfaceid=" + surfaceid.split("/resource/")[1]
        Axios.get(alUrl).then((d2) => {
          const resources = d2.data.resources
            this.setState((prevState) => {
              const newSurface = {
                currentSurfaceId: surfaceid,
                surfaceTitle: b.surfaceTitle.value,
                //manifest: manifest,
                canvas: b.canvas.value,
                imageurl: b.imageurl.value,
                next: b.next_surface ? b.next_surface.value : "",
                previous: b.previous_surface ? b.previous_surface.value : "",
                annotations: d2.data ? d2.data.resources : "",
                surfaceid: surfaceid,
                firstLine: firstLine,
                lastLine: lastLine,
                order: order

              }
            return {
              surfaces: [
                ...prevState.surfaces,
                newSurface

              ]
            }
          })
        }).catch((error) => {
            console.log("failed retrieving annotationlist: ", error)
            this.setState((prevState) => {
              const newSurface = {
                currentSurfaceId: surfaceid,
                surfaceTitle: b.surfaceTitle.value,
                //manifest: manifest,
                canvas: b.canvas.value,
                imageurl: b.imageurl.value,
                next: b.next_surface ? b.next_surface.value : "",
                previous: b.previous_surface ? b.previous_surface.value : "",
                annotations: "",
                surfaceid: surfaceid,
                firstLine: firstLine,
                lastLine: lastLine,
                order: order

              }
            return {
              surfaces: [
                ...prevState.surfaces,
                newSurface
              ]
            }
          })
        })
      })
    })
  })
}
componentDidMount(){
    if (this.props.manifestationid){
      this.setState((prevState) => {
        return {
          surfaces: []
        }
      },
      this.retrieveSurfaceInfo(this.props.manifestationid)
    )
    }
  }
  componentWillReceiveProps(nextProps){
    if (nextProps.manifestationid != this.props.manifestationid){
      this.setState((prevState) => {
        return {
          surfaces: []
        }

      },
    this.retrieveSurfaceInfo(nextProps.manifestationid))
    }
  }
  render() {
    const displayAllImages = () => {
      const sortedSurfaces = this.state.surfaces.sort((a, b) => {
        if (a.order > b.order) return 1;
        if (b.order > a.order) return -1;
        return 0;
      })
      const surfacesDisplay = sortedSurfaces.map((surface) => {
        return displayImages(surface)
      })
      return surfacesDisplay
    }
    const displayImages = (surface) => {

      // handle line display
      if (surface.annotations && this.state.annotationsDisplay === "lines"){
        const imageTextWrappers = surface.annotations.map((h, i) => {

          if (i + 1 >= surface.firstLine && i < surface.lastLine){
            console.log("first line", surface.firstLine)
            console.log("index", i)
            const text = h.resource.chars;
            const canvas = h.on.split("#xywh=")[0];
            const canvasShort = canvas.split("/")[canvas.split("/").length - 1];
            const coords = h.on.split("#xywh=")[1];
            const imageUrl = h.imageUrl
            const label = h.label
            const match = label === this.props.targetLabel ? true : false
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
            }

        })
        return imageTextWrappers
      }
      // handle paragraph display
      else if (surface.annotations && this.state.annotationsDisplay === "paragraph"){
        console.log(surface)
        const h = surface.annotations[surface.firstLine - 1]
        const fl = surface.annotations[surface.firstLine - 1]
        const flcanvas = fl.on.split("#xywh=")[0];
        const flcanvasShort = flcanvas.split("/")[flcanvas.split("/").length - 1];
        const flcoords = fl.on.split("#xywh=")[1];
        const y = flcoords.split(",")[1]
        console.log("surface annotations", surface.annotations)
        const ll = surface.annotations[surface.lastLine - 1]
        const llcanvas = ll ? ll.on.split("#xywh=")[0] : ""
        const llcanvasShort = llcanvas.split("/")[llcanvas.split("/").length - 1];
        const llcoords = ll ? ll.on.split("#xywh=")[1] : ""
        console.log("flcoords", flcoords)
        console.log("llcoords", llcoords)
        const lly = llcoords.split(",")[1]
        const llh = llcoords.split(",")[3]
        const llbottom = (parseInt(lly) + parseInt(llh)) - parseInt(y)
        const coords = (parseInt(flcoords.split(",")[0] - 10)) + "," + (parseInt(y) - 50) + "," + (parseInt(flcoords.split(",")[2]) + 10) + "," + (parseInt(llbottom) + 50)
        console.log("finalcoords", coords)
        const text = ""
        const imageUrl = h.imageUrl

        return (
          <ImageTextWrapper
            imageUrl={imageUrl}
            canvas={flcanvas}
            coords={coords}
            canvasShort={flcanvasShort}
            text={text}
            label={""}
            targetLabel={""}
            surfaceButton={false}
            displayWidth="1000"
            />
          )
        }
      else{
        return <img src={surface.imageurl + "/full/" + this.state.width + ",/0/default.jpg"}/>
      }
    }
    return (
      <Container className={this.props.hidden ? "hidden" : "showing"}>
      <a onClick={() => {this.handleToggleTextLinesView("lines")}}>Text Lines View</a>
      <a onClick={() => {this.handleToggleTextLinesView("paragraph")}}>Text Paragraph View</a>
      <a onClick={() => {this.handleToggleTextLinesView("surface")}}>Surface View</a>
      {displayAllImages()}
      </Container>

    );
  }

}

export default Surface3;
