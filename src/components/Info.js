import React from 'react';
import { FaClipboard} from 'react-icons/fa';
import {Link} from 'react-router-dom';

class Info extends React.Component {
  constructor(props){
    super(props)
    this.copyToClipboard = this.copyToClipboard.bind(this)

  }
  copyToClipboard(string){
    var dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = string;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
  }
  componentDidMount(){


  }
  componentWillReceiveProps(newProps){

  }

  render(){
    const displayRelatedExpressions = () => {
      //prevents against rendering if info is not present
      if (this.props.info){
        //prevents against rendering if relatedExpressions is not present
        if (this.props.info.relatedExpressions){
          const relatedExpressions = this.props.info.relatedExpressions.map((r) => {
            return <p key={r.resourceid}>{r.relationLabel} <Link to={"/text?resourceid=" + r.resourceid}>{r.resourceid}</Link></p>
          })
          return relatedExpressions
        }
      }
    }
    const displayManifestations = () => {
      if (this.props.info){
        const manifestations = this.props.info.manifestations.map((i) => {
          return <p key={i.manifestation}>{i.manifestationTitle} : <Link to={"/text?resourceid=" + i.manifestation}>{i.manifestation}</Link></p>
        })
        return manifestations
      }
    }
    const displayInfo = () => {
      if (this.props.info){
        const resourceid = this.props.info.resourceid.includes('http') ? this.props.info.resourceid : "http://scta.info/resource/" + this.props.info.resourceid
        return(
          <div>
          <p key="id">Resourceid: {resourceid}  <span title="Copy resource id" onClick={(e) => {e.preventDefault(); this.copyToClipboard(resourceid)}}><FaClipboard /></span></p>
          <p key="inbox">LDN Inbox: {this.props.info.inbox}</p>
          </div>
        )
      }
    }
  return (

    <div className={this.props.hidden ? "hidden" : "showing"}>
      <h1>Info</h1>
      {displayInfo()}
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
