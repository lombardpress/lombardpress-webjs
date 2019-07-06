import React from 'react';

import {FaExternalLinkAlt, FaChevronDown} from 'react-icons/fa';
import {Link} from 'react-router-dom';

import {runQuery} from './utils'
import {getChildParts} from './Queries'
class TextOutline extends React.Component {
  constructor(props){
    super(props)
    this.handleToggleChildren = this.handleToggleChildren.bind(this)
    this.state = {
      parts: [],
      showChildren: false
    }

  }
  handleToggleChildren(e){
    e.preventDefault();
    this.setState((prevState) => {
      return {showChildren: !prevState.showChildren}
    })
  }
  retrieveParts(resourceid){
    const partsInfo = runQuery(getChildParts(resourceid))
    partsInfo.then((data) => {
      const newData = data.data.results.bindings.map((d) => {
        return {
          part: d.part.value,
          title: d.title.value,
          level: d.level.value
        }
      })
      this.setState({parts: newData})
    })
  }
  componentDidMount(){
    this.setState({showChildren: this.props.showChildren})
    this.retrieveParts(this.props.resourceid)
  }
  componentWillReceiveProps(newProps){
    if (newProps.resourceid != this.props.resourceid){
      this.setState({showChildren: this.props.showChildren})
      this.retrieveParts(this.props.resourceid)
    }
  }
  render(){
    const displayChildren = () => {
      const parts = this.state.parts.map((p) => {
        return <TextOutline showChildren={false} resourceid={p.part} title={p.title}/>
      })
      return parts
    }
    return (
      <div id="outline" className={this.props.hidden ? "hidden" : "showing"}>
        <p>
        {this.props.title}
        <a href="#" onClick={this.handleToggleChildren}><FaChevronDown/></a>
        <Link to={"/text?resourceid=" + this.props.resourceid}><FaExternalLinkAlt/></Link>
        </p>
        {this.state.showChildren && displayChildren()}
      </div>
    );
  }
}

export default TextOutline;
