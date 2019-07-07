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
      // async seems to be working pretty well and efficiently.
      // if a section has many parts, it will be fired several times.
      // if it has a 100 parts, it will fire 100 times.
      // But 100 doesn't seem to causing serious performance issues.
      console.log("async test; fired")
      const newData = data.data.results.bindings.map((d) => {
        return {
          part: d.part.value,
          title: d.title.value,
          level: d.level.value,
          structureType: d.structureType.value,
          questionTitle: d.questionTitle ? d.questionTitle.value : ""
        }
      })
      this.setState({parts: newData})
    })
  }
  componentDidMount(){
    //this.setState({showChildren: this.props.showChildren})
    this.retrieveParts(this.props.resourceid)

    if (this.props.membersOf){
      if (this.props.membersOf.includes(this.props.resourceid)) {
        this.setState({showChildren: true})

      }
    }

  }
  componentWillReceiveProps(newProps){
    if (newProps.resourceid != this.props.resourceid){
      this.retrieveParts(this.props.resourceid)
    }
    if (newProps.resourceid != this.props.resourceid || newProps.membersOf != this.props.membersOf){
      if (newProps.membersOf){
        if (newProps.membersOf.includes(newProps.resourceid)) {
          this.setState({showChildren: true})
        }
        // else{
        //   this.setState({showChildren: false})
        // }
      }
    }

  }
  render(){
    const displayChildren = () => {
      const parts = this.state.parts.map((p) => {
        let bold = ""
        if (this.props.membersOf){
          if (this.props.membersOf.includes(p.part) || p.part === this.props.focusResourceid) {
            bold = "bold"
            //showChildren = true;
          }
        }
        return <TextOutline bold={bold} key={p.part} focusResourceid={this.props.focusResourceid} showChildren={this.state.showChildren} resourceid={p.part} title={p.title} level={p.level} structureType={p.structureType} membersOf={this.props.membersOf} questionTitle={p.questionTitle}/>
      })
      return parts
    }
    const indent = this.props.level * 5
    return (
      <div id="outline" style={{"paddingLeft": indent + "px"}}>
        <p className={this.props.bold}>
        {this.props.title}
        {this.props.questionTitle && <span>: {this.props.questionTitle}</span>}
        {(this.state.parts.length > 0 && !this.state.showChildren) && <a href="#" onClick={this.handleToggleChildren}><FaChevronDown/></a>}
        {(this.state.parts.length > 0 && this.state.showChildren) && <a href="#" onClick={this.handleToggleChildren}><FaChevronUp/></a>}
        {this.props.structureType != "http://scta.info/resource/structureCollection" && <Link to={"/text?resourceid=" + this.props.resourceid}><FaExternalLinkAlt/></Link>}
        </p>
        {this.state.showChildren && displayChildren()}
      </div>
    );
  }
}

export default TextOutline;
