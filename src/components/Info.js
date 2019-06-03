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
    const displayRelatedExpressions = () => {
      const relatedExpressions = this.props.relatedExpressions.map((r) => {
        return <p key={r}>{r}</p>
      })
      return relatedExpressions
    }
    const displayManifestations = () => {
      const manifestations = this.props.info.manifestations.map((i) => {
        return <p key={i.manifestation}>{i.manifestationTitle} : {i.manifestation}</p>
      })
      return manifestations
    }

  return (

    <div className={this.props.hidden ? "hidden" : "showing"}>
      <h1>Info</h1>
      <p key="id">Resourceid: {this.props.info.resourceid.includes('http') ? this.props.info.resourceid : "http://scta.info/resource/" + this.props.info.resourceid}</p>
      <p key="inbox">LDN Inbox: {this.props.info.inbox}</p>
      <div>
      <p>Manifestations</p>
      {displayManifestations()}
      </div>
      <div>
      <p>Related Expression</p>
      {displayRelatedExpressions()}
      </div>



    </div>
    );
  }
}

export default Info;
