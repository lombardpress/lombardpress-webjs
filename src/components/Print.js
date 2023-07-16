//Vendor Imports
import React from 'react';
import Axios from 'axios'
import PropTypes from 'prop-types';

class Print extends React.Component {
  constructor(props){
    super(props)
    this.getPdf = this.getPdf.bind(this)
    this.state = {
      status: "",
      pdf: "",
    }
  }
  getPdf(url){
    const printApiUrlBase = "https://print.lombardpress.org"
    //const printApiUrlBase = "localhost:5000"
    Axios.get(printApiUrlBase + "/api/v1/resource?url=" + url)
      .then((data) => {
        console.log(data)
        if (data.data.url){
          console.log("first condition passed", data.data.url)
          const hashWithExtension = data.data.url
          //window.location = "http://print.lombardpress.org/api/v1/cache/" + hashWithExtension
          this.setState({pdf: printApiUrlBase + "/api/v1/cache/" + hashWithExtension})
        }
        else{
          this.setState({status: data.data.Status + "Please check back in a few minutes", pdf: ""})
        }
      })

  }
  componentDidMount(){
    const url = this.props.url
    this.getPdf(url)
  }
  
  componentDidUpdate(prevProps){
    const newUrl = this.props.url
    const oldUrl = prevProps.url
    if (newUrl !== oldUrl){
      this.getPdf(newUrl)
    }
  }
  render(){

    return (
      <div style={{"width": "100%", "height": "77vh", "margin": "auto"}}>
      {this.state.pdf ?
        <object data={this.state.pdf} type="application/pdf" width="100%" height="100%">
            alt : <a href={this.state.pdf}>{this.state.pdf}</a>
        </object>
        :
        <p>{this.state.status}</p>
        }
    </div>
    );
  }
}

Print.propTypes = {
  /**
  * url to raw xml source file
  */
 url: PropTypes.string.isRequired,
}

export default Print;
