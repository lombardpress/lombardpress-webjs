import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import Axios from 'axios'

const ImageLogo = (props) => {
  const [logoUrl, setLogoUrl] = useState("")
  useEffect(() => {
    // conditional set in order prevent ajax request if props.imagurl does not exist
    if (props.imageurl){
      Axios.get(props.imageurl + "/info.json").then((d) => {
        const logo = d.data.logo["@id"]
        setLogoUrl(logo)
      }).catch((error) => {
        console.log("no logo found", error)
        setLogoUrl("")
      })
    }
  }, [props.imageurl])
  return (
    <>{logoUrl && <img src={logoUrl} style={{margin: props.margin, height: props.height}}/>}</>
  )
}

ImageLogo.defaultProps = {
  height: "20px",
  margin: "5px"
};

ImageLogo.propTypes = {
  /**
  * imageurl (without iiif parameters) for which logo will be requested
  **/
  imageurl: PropTypes.string.isRequired,
  margin: PropTypes.string,
  height: PropTypes.string

}
export default ImageLogo;
