import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import OpenSeadragon from 'openseadragon';
import Axios from 'axios'

const OSDInstance = (props) => {
  const [instance, setInstance] = useState()
  const setBounds = (instance, inputCoords, imageW, imageH) => {
    if (inputCoords) {
      instance.addHandler("open", function () {

        const coords = inputCoords.split(",")
        const x = parseInt(coords[0])
        const y = parseInt(coords[1])
        const w = parseInt(coords[2])
        const h = parseInt(coords[3])

        const ar = imageH / imageH
        const xcomp = x / imageW
        const ycomp = (y / imageH) * ar
        const wcomp = w / imageW
        const hcomp = (h / imageH) * ar

        const newRect = instance.viewport.imageToViewportRectangle(x, y, w, h)


        /** 
        
        :xcomp => (result[:ulx].to_s.to_i / totalW),
        :ycomp => (result[:uly].to_s.to_i / totalH) * aspectratio,
        :heightcomp => (result[:height].to_s.to_i / totalH) * aspectratio,
        :widthcomp => result[:width].to_s.to_i / totalW,
        
        **/

        const rect = new OpenSeadragon.Rect(xcomp, ycomp, wcomp, hcomp)
        console.log("rect", rect)

        const myBounds = instance.viewport.fitBounds(newRect, true);

        //this helps to keep the viewer in the same spot when toggling full screen
        instance.preserveViewport = true;

        /* this resets the home tool tip to the rectangle focused on
          i'm not sure what contentSize.x does -- but it's important for this reset of home to work correctly
          this below line kind of works, but it prevents someone from being able to move around and navigate away from Home.
  
        */
        //instance.viewport.setHomeBounds(rect, instance.viewport.contentSize.x);



      });
    }

  }
  useEffect(() => {
    Axios.get(props.imageurl + "/info.json").then((d) => {
      console.log("data", d.data)
      //d.data["tiles"] = [{"scaleFactors": [1, 2, 4, 8], "width": 300}]
      const customControlIds = {
        zoomInButton: "zoom-in",
        zoomOutButton: "zoom-out",
        //homeButton: "home",
        fullPageButton: "full-page",
        nextButton: "next",
        previousButton: "previous"
      };
      if (instance) {
        // Modify tile source as needed
        instance.addTiledImage({
          tileSource: d.data
        });
      }
      else {
        const id = props.coords ? "osd-" + props.coords : "osd"
        const instance = OpenSeadragon({
          id: id,
          prefixUrl: "/img/openseadragon/",
          preserveViewport: true,
          visibilityRatio: 1,
          minZoomLevel: 1,
          defaultZoomLevel: 1,
          tileSources: [d.data],
          ...customControlIds,
          overlays: [{
            id: 'example-overlay',
            x: 0.33,
            y: 0.75,
            width: 0.2,
            height: 0.25,
            className: 'osdhighlight'
          }]
        })
        setBounds(instance, props.coords, d.data.width, d.data.height)
        setInstance(instance)
      }
    })
  }, [props.imageurl, props.coords])
  const handleAddOverlay = () => {
    console.log('click firining')

    const elt = document.createElement("div");
    elt.id = "runtime-overlay1";
    elt.className = "osdhighlight";
    instance.addOverlay({
      element: elt,
      location: new OpenSeadragon.Rect(0.33, 0.90, 0.4, 0.45)
    });


  }


  return (
    <div>
      {
        //<p onClick={handleAddOverlay}>Add overlay</p>
      }
      {
        props.coords ? <div id={"osd-" + props.coords} className="open-seadragon-container" style={{ height: props.coords ? props.coords.split(",")[3] + "px" : "1000px", width: props.coords ? props.coords.split(",")[2] + "px" : "" }}></div>
        : <div id="osd" className="open-seadragon-container" style={{ height: "1000px" }}></div>
      }

    </div>
  )
}

OSDInstance.defaultProps = {
  imageurl: "https://loris2.scta.info/vat/V145v.jpg"
};
OSDInstance.propTypes = {
  /**
  * imageurl (without iiif parameters) for which logo will be requested
  **/
  imageurl: PropTypes.string.isRequired,

}

export default OSDInstance;