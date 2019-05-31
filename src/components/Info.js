import React from 'react';
import Axios from "axios"

class Info extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      id: props.id,
      title: "",
      manifestations: [],
      inbox: []
    }
  }
  componentDidMount(){
    const _this = this;
    if (this.props.resourceid){
      console.log("props", this.props)
      const fullId = "https://scta.info/resource/" + this.props.resourceid
      Axios.get(fullId)
      .then(function(data){
        console.log("data", data)

        const info = data.data["http://scta.info/resource/" + _this.props.resourceid]
        console.log(data.data)
        _this.setState({
          title: info["http://purl.org/dc/elements/1.1/title"][0].value,
          manifestations: info["http://scta.info/property/hasManifestation"],
          inbox: info["http://www.w3.org/ns/ldp#inbox"]
        })
      })
    }
  }

  render(){
    const displayManifestations = () => {
      const newManifestations = this.state.manifestations.map((m) => {return <p>{m.value}</p>})
      return newManifestations
    }
  return (

    <div>
      <h1>Window</h1>
      <p>Title: {this.state.title}</p>
      
      {displayManifestations()}

    </div>
    );
  }
}

export default Info;
