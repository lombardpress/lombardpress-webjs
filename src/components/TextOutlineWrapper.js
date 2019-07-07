import React from 'react';
import TextOutline from './TextOutline'

import {runQuery} from './utils'
import {getMembersOf} from './Queries'

class TextOutlineWrapper extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      membersOf: [],
    }
  }
  retrieveMembersOf(resourceid){
    const membersOfInfo = runQuery(getMembersOf(resourceid))
    membersOfInfo.then((data) => {
      const newData = data.data.results.bindings.map((d) => {
        return d.memberOf.value
      })
      this.setState({membersOf: newData})
    })
  }
  componentDidMount(){
    this.retrieveMembersOf(this.props.focusResourceid)
  }
  componentWillReceiveProps(newProps){
    if (newProps.focusResourceid !== this.props.focusResourceid){
      this.retrieveMembersOf(newProps.focusResourceid)
    }
  }
  render(){
    return (
      <div className={this.props.hidden ? "hidden" : "showing"}>
      <TextOutline key={this.props.resourceid} showChildren={true} focusResourceid={this.props.focusResourceid} resourceid={this.props.resourceid} title={this.props.title} level={1} structureType={"http://scta.info/resource/structureCollection"} membersOf={this.state.membersOf}/>
      </div>
    );
  }
}

export default TextOutlineWrapper;
