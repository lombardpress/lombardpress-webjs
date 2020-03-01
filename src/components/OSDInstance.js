import React, {useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import OpenSeadragon from 'openseadragon';
import Axios from 'axios'

const OSDInstance = (props) => {
  const [instance, setInstance] = useState()
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
      if (instance){
        // Modify tile source as needed
        instance.addTiledImage({
            tileSource: d.data
        });
      }
      else{
        setInstance(
          OpenSeadragon({
          id: "osd",
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
      )
    }
  })
  }, [props.imageurl])
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
      <div id={"osd"} className="open-seadragon-container" style={{ height: '100vh' }}></div>
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