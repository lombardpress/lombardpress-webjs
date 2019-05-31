import React from 'react';
import Axios from "axios"

class Info extends React.Component {
  constructor(props){
    super(props)
    this.retrieveInfo = this.retrieveInfo.bind(this)
    this.state = {
      resourceid: "",
      title: "",
      manifestations: [],
      inbox: []
    }
  }
  retrieveInfo(resourceid){
    const _this = this;
    if (resourceid){
      const fullId = resourceid.includes('http') ? resourceid : "https://scta.info/resource/" + resourceid
      const fullIdWithoutHttps = resourceid.includes('http') ? resourceid : "http://scta.info/resource/" + resourceid
      Axios.get(fullId)
      .then(function(data){
        const info = data.data[fullIdWithoutHttps]
        _this.setState({
          resourceid: resourceid,
          title: info["http://purl.org/dc/elements/1.1/title"][0].value,
          structureType: info["http://scta.info/property/structureType"][0].value,
          manifestations: info["http://scta.info/property/hasManifestation"],
          inbox: info["http://www.w3.org/ns/ldp#inbox"][0].value,
          next: info["http://scta.info/property/next"][0].value,
          previous: info["http://scta.info/property/previous"][0].value,
        })
      })
    }
  }
  componentDidMount(){
    this.retrieveInfo(this.props.resourceid)

  }
  componentWillReceiveProps(newProps){
    this.retrieveInfo(newProps.resourceid)
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
      {this.state.next && <p onClick={() => {this.props.handleBlockFocusChange(this.state.next)}}>Next</p>}
      {this.state.previous && <p onClick={() => {this.props.handleBlockFocusChange(this.state.previous)}}>Previous</p>}
      <p>Resourceid: {this.state.resourceid.includes('http') ? this.state.resourceid : "http://scta.info/resource/" + this.state.resourceid}</p>
      <p>LDN Inbox: {this.state.inbox}</p>

      {displayManifestations()}

    </div>
    );
  }
}

export default Info;
