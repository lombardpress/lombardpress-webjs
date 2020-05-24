import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import OpenSeadragon from 'openseadragon';
import Axios from 'axios'
import uuidv4 from 'uuid/v4';

const OSDInstance = (props) => {
  const [instance, setInstance] = useState()
  const [viewerWidthHeight, setViewerWidthHeight] = useState({ w: "", h: "" })
  const [viewerId] = useState(uuidv4())
  useEffect(() => {
    if (props.coords){
      setViewerWidthHeight(computeViewerWidthHeight(props.coords.split(",")[2], props.coords.split(",")[3]))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.coords])
  useEffect(() => {
    Axios.get(props.imageurl + "/info.json").then((d) => {
      if (instance) {
        // Modify tile source as needed to already existing instance
        instance.addTiledImage({
          tileSource: d.data
        });
        if (props.coords) {
          // this should be another way to get Scalar coordinates, but it doesn't seem to be working
          //const newRect = instance.viewport.imageToViewportRectangle(x, y, w, h)
          const sc = getScalarCoordinates(props.coords, d.data.height, d.data.width)
          const rect = new OpenSeadragon.Rect(sc.x, sc.y, sc.w, sc.h)
          setBounds(instance, rect)
          setOverlay(instance, rect)
          if (props.lineFocusCoords){
            const lsc = getScalarCoordinates(props.lineFocusCoords, d.data.height, d.data.width)
            const linerect = new OpenSeadragon.Rect(lsc.x, lsc.y, lsc.w, lsc.h)
            setOverlay(instance, linerect)
          
          }
          setGoHome(instance, rect)
          instance.viewport.fitBounds(rect)
        }
      }
      else {
        const id = "osd-" + viewerId
        const instance = OpenSeadragon({
          id: id,
          prefixUrl: "/img/openseadragon/",
          preserveViewport: true, //this helps to keep the viewer in the same spot when toggling full screen
          visibilityRatio: 1,
          minZoomLevel: 1,
          defaultZoomLevel: 1,
          tileSources: [d.data],
          controlsFadeDelay: 0,
          controlsFadeLength: 25
        })
        if (props.coords) {
          // this should be another way to get Scalar coordinates, but it doesn't seem to be working
          //const newRect = instance.viewport.imageToViewportRectangle(x, y, w, h)
          const sc = getScalarCoordinates(props.coords, d.data.height, d.data.width)
          const rect = new OpenSeadragon.Rect(sc.x, sc.y, sc.w, sc.h)
          setBounds(instance, rect)
          setOverlay(instance, rect)
          if (props.lineFocusCoords){
            const lsc = getScalarCoordinates(props.lineFocusCoords, d.data.height, d.data.width)
            const linerect = new OpenSeadragon.Rect(lsc.x, lsc.y, lsc.w, lsc.h)
            setOverlay(instance, linerect)
        }
          setGoHome(instance, rect)
        }
        setInstance(instance)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.imageurl, props.coords])

  const setOverlay = (instance, rect) => {
    instance.addHandler("open", function () {
      const id = uuidv4()
      const elt = document.createElement("div");
      elt.id = "runtime-overlay-" + id;
      elt.className = "osdhighlight";
      instance.addOverlay({
        element: elt,
        location: rect
      });
    })
  }
  const setBounds = (instance, rect) => {
    instance.addHandler("open", function () {
      instance.viewport.fitBounds(rect, true);
    });
  }
  const setGoHome = (instance, rect) => {
    //OpenSeadragon.Viewport.prototype.goHome = function () {
    instance.viewport.goHome = function () {
      // Give it whatever rectangle you want
      this.fitBounds(rect);
    }
  }
  const getScalarCoordinates = (inputCoords, imageH, imageW) => {
    const coords = inputCoords.split(",")
    const x = parseInt(coords[0])
    const y = parseInt(coords[1])
    const w = parseInt(coords[2])
    const h = parseInt(coords[3])

    const ar = imageH / imageW
    const xcomp = x / imageW
    const ycomp = (y / imageH) * ar
    const wcomp = w / imageW
    const hcomp = (h / imageH) * ar
    return { x: xcomp, y: ycomp, w: wcomp, h: hcomp }
  }
  const computeViewerWidthHeight = (w, h) => {
    const displayWidth = props.displayWidth
    const newHeight = displayWidth * (parseInt(h) / parseInt(w))
    return { w: displayWidth, h: newHeight }
  }
  return (
    <div>
      {
        //<p onClick={handleAddOverlay}>Add overlay</p>
      }
      {
        props.coords ? <div id={"osd-" + viewerId} className="open-seadragon-container" style={{ height: viewerWidthHeight.h + "px", width: viewerWidthHeight.w + "px" }}></div>
          : <div id={"osd-" + viewerId} className="open-seadragon-container" style={{ height: "100vh" }}></div>
      }

    </div>
  )
}

OSDInstance.defaultProps = {
  imageurl: "https://loris2.scta.info/vat/V145v.jpg",
  displayWidth: 1000
};
OSDInstance.propTypes = {
  /**
  * imageurl (without iiif parameters) for which logo will be requested
  **/
  imageurl: PropTypes.string.isRequired,

}

export default OSDInstance;