import React from 'react';
import Container from 'react-bootstrap/Container';
import {runQuery} from './utils'
import {getSurfaceInfo} from './Queries'


class Surface2 extends React.Component {
  constructor(props){
    super(props)
    this.handleNext = this.handleNext.bind(this)
    this.handlePrevious = this.handlePrevious.bind(this)
    this.state = {
      currentSurfaceId: "",
      manifest: "",
      canvas: "",
      region: "full",
      width: "1000",
      next: "",
      previous: "",
      imageurl: ""
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
  retrieveSurfaceInfo(surfaceid){
    console.log('surfaceid', surfaceid)
    // manifest id should be retrieved from query
    // this is a temporary measure until db is corrected and query is posible
    
    const manifest = "http://scta.info/iiif/" + this.props.topLevel.split("/resource/")[1] + "/" + surfaceid.split("/resource/")[1].split("/")[0] + "/" + "manifest";
    const surfaceInfo = runQuery(getSurfaceInfo(surfaceid))
    surfaceInfo.then((d) => {
      const b = d.data.results.bindings[0]
      this.setState({
        currentSurfaceId: surfaceid,
        surfaceTitle: b.surfaceTitle.value,
        manifest: manifest,
        canvas: b.canvas.value,
        imageurl: b.imageurl.value,
        next: b.next_surface ? b.next_surface.value : "",
        previous: b.previous_surface ? b.previous_surface.value : ""

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
    return (
      <Container className={this.props.hidden ? "hidden" : "showing"}>
      {this.state.currentSurfaceId ?
        <div>
          <div className="surface-navigation">
            <p>{this.state.surfaceTitle}</p>
            {this.state.previous && <p><a onClick={this.handlePrevious}>Previous</a></p>}
            {this.state.next && <p><a onClick={this.handleNext}>Next</a></p>}
          </div>
          <img src={this.state.imageurl + "/" + this.state.region + "/" + this.state.width + ",/0/default.jpg"}/>
        </div> : <p>No surface selected</p>}
      </Container>

    );
  }

}

export default Surface2;
