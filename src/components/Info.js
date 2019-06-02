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

  return (

    <div className={this.props.hidden ? "hidden" : "showing"}>
      <h1>Info</h1>
      <p key="id">Resourceid: {this.props.info.resourceid.includes('http') ? this.props.info.resourceid : "http://scta.info/resource/" + this.props.info.resourceid}</p>
      <p key="inbox">LDN Inbox: {this.props.info.inbox}</p>



    </div>
    );
  }
}

export default Info;
