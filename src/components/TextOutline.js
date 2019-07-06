import React from 'react';

import {FaExternalLinkAlt, FaChevronDown, FaChevronUp} from 'react-icons/fa';
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
        return <TextOutline key={p.part} showChildren={false} resourceid={p.part} title={p.title} level={p.level}/>
      })
      return parts
    }
    const indent = this.props.level * 5
    return (
      <div id="outline" className={this.props.hidden ? "hidden" : "showing"} style={{"padding-left": indent + "px"}}>
        <p>
        {this.props.title}
        {(this.state.parts.length > 0 && !this.state.showChildren) && <a href="#" onClick={this.handleToggleChildren}><FaChevronDown/></a>}
        {(this.state.parts.length > 0 && this.state.showChildren) && <a href="#" onClick={this.handleToggleChildren}><FaChevronUp/></a>}
        <Link to={"/text?resourceid=" + this.props.resourceid}><FaExternalLinkAlt/></Link>
        </p>
        {this.state.showChildren && displayChildren()}
      </div>
    );
  }
}

export default TextOutline;
