import React from 'react';
import Axios from "axios"

class Info extends React.Component {
  constructor(props){
    super(props)


  }

  componentDidMount(){


  }
  componentWillReceiveProps(newProps){

  }

  render(){
    const displayManifestations = () => {
      const newManifestations = this.props.info.manifestations.map((m) => {return <p>{m.value}</p>})
      return newManifestations
    }
  return (

    <div>
      <h1>Info</h1>
      <p>Resourceid: {this.props.info.resourceid.includes('http') ? this.props.info.resourceid : "http://scta.info/resource/" + this.props.info.resourceid}</p>
      <p>LDN Inbox: {this.props.info.inbox}</p>

      {displayManifestations()}

    </div>
    );
  }
}

export default Info;
