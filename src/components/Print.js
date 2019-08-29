import React from 'react';
import Qs from "query-string"
import Axios from 'axios'

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
    Axios.get("https://print.lombardpress.org/api/v1/resource?url=" + url)
      .then((data) => {
        console.log(data)
        if (data.data.url){
          console.log("first condition passed", data.data.url)
          const hashWithExtension = data.data.url.split("/cache/")[1]
          //window.location = "http://print.lombardpress.org/api/v1/cache/" + hashWithExtension
          this.setState({pdf: "http://print.lombardpress.org/api/v1/cache/" + hashWithExtension})
        }
        else{
          this.setState({status: data.data.Status + "Please check back in a few minutes", pdf: ""})
        }
      })

  }
  componentDidMount(){
    let url = ""
    if (this.props.url){
      url = this.props.url
    }
    else{
     url = Qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).url
    }
    this.getPdf(url)
  }
  componentWillReceiveProps(newProps){
    let newUrl = ""
    let oldUrl = ""
    if (newProps.url && this.props.url){
      newUrl = newProps.url
      oldUrl = this.props.url
    }
    else{
      newUrl = Qs.parse(newProps.location.search, { ignoreQueryPrefix: true }).url
      oldUrl = Qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).url
    }

    if (newUrl != oldUrl){
      this.getPdf(newUrl)
    }
  }
  render(){
    return (
      <div style={{"width": "100vh", "height": "100vh", "margin": "auto"}}>
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

export default Print;
