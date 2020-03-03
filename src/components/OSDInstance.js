import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import OpenSeadragon from 'openseadragon';
import Axios from 'axios'

const OSDInstance = (props) => {
  const [instance, setInstance] = useState()
  const [viewerWidthHeight, setViewerWidthHeight] = useState({ w: "", h: "" })
  useEffect(() => {
    if (props.coords){
      setViewerWidthHeight(computeViewerWidthHeight(props.coords.split(",")[2], props.coords.split(",")[3]))
    }
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
          setGoHome(instance, rect)
          instance.viewport.fitBounds(rect)
        }
      }
      else {
        const id = props.coords ? "osd-" + props.coords : "osd"
        const instance = OpenSeadragon({
          id: id,
          prefixUrl: "/img/openseadragon/",
          preserveViewport: true, //this helps to keep the viewer in the same spot when toggling full screen
          visibilityRatio: 1,
          minZoomLevel: 1,
          defaultZoomLevel: 1,
          tileSources: [d.data]
        })
        if (props.coords) {
          // this should be another way to get Scalar coordinates, but it doesn't seem to be working
          //const newRect = instance.viewport.imageToViewportRectangle(x, y, w, h)
          const sc = getScalarCoordinates(props.coords, d.data.height, d.data.width)
          const rect = new OpenSeadragon.Rect(sc.x, sc.y, sc.w, sc.h)
          setBounds(instance, rect)
          setOverlay(instance, rect)
          setGoHome(instance, rect)

        }

        setInstance(instance)
      }
    })
  }, [props.imageurl, props.coords])
  const setOverlay = (instance, rect) => {
    instance.addHandler("open", function () {
      const elt = document.createElement("div");
      elt.id = "runtime-overlay1";
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
    const coords = props.coords.split(",")
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
    const desiredWidth = props.desiredWidth
    const newHeight = desiredWidth * (parseInt(h) / parseInt(w))
    console.log("newHeight", newHeight)
    console.log(desiredWidth, newHeight)
    return { w: desiredWidth, h: newHeight }
  }
  return (
    <div>
      {
        //<p onClick={handleAddOverlay}>Add overlay</p>
      }
      {
        props.coords ? <div id={"osd-" + props.coords} className="open-seadragon-container" style={{ height: viewerWidthHeight.h + "px", width: viewerWidthHeight.w + "px" }}></div>
          : <div id="osd" className="open-seadragon-container" style={{ height: "100vh" }}></div>
      }

    </div>
  )
}

OSDInstance.defaultProps = {
  imageurl: "https://loris2.scta.info/vat/V145v.jpg",
  desiredWidth: 1000
};
OSDInstance.propTypes = {
  /**
  * imageurl (without iiif parameters) for which logo will be requested
  **/
  imageurl: PropTypes.string.isRequired,

}

export default OSDInstance;