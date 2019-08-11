import React from 'react';
import PropTypes from 'prop-types';
import {FaExternalLinkAlt, FaChevronDown, FaChevronUp} from 'react-icons/fa';
import {Link} from 'react-router-dom';

import {runQuery} from './utils'
import {getChildParts} from './Queries'

/**
* creates a text outline section
*/
class TextOutline extends React.Component {
  constructor(props){
    super(props)
    this.handleToggleChildren = this.handleToggleChildren.bind(this)
    this.state = {
      parts: [],
      showChildren: false
    }

  }
  /**
    @public
    * toggles state.showChildren indicating whether or not section children should be mounted
  */
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
      //console.log("async test; fired")
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
    if (newProps.resourceid !== this.props.resourceid){
      this.retrieveParts(this.props.resourceid)
    }
    if (newProps.resourceid !== this.props.resourceid || newProps.membersOf !== this.props.membersOf){
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
        return <TextOutline
        bold={bold}
        key={p.part}
        focusResourceid={this.props.focusResourceid}
        showChildren={this.state.showChildren}
        resourceid={p.part}
        title={p.title}
        level={p.level}
        structureType={p.structureType}
        membersOf={this.props.membersOf}
        questionTitle={p.questionTitle}
        mtFocus={this.props.mtFocus}
        collectionLink={p.structureType === "http://scta.info/resource/structureCollection" ? this.props.collectionLink : true}/>
      })
      return parts
    }
    const indent = this.props.level * 5
    return (
      <div id="outline" style={{"paddingLeft": indent + "px"}}>
        <p className={this.props.bold}>
        {this.props.title}
        {this.props.questionTitle && <span>: {this.props.questionTitle}</span>}
        {(this.state.parts.length > 0 && !this.state.showChildren) && <span className="outlineArrow" onClick={this.handleToggleChildren}><FaChevronDown/></span>}
        {(this.state.parts.length > 0 && this.state.showChildren) && <span className="outlineArrow" onClick={this.handleToggleChildren}><FaChevronUp/></span>}
        {this.props.collectionLink && <Link to={"/text?resourceid=" + this.props.resourceid + this.props.mtFocus} ><FaExternalLinkAlt/></Link>}
        </p>
        {this.state.showChildren && displayChildren()}
      </div>
    );
  }
}

TextOutline.propTypes = {
  /**
  * resource id of focused passage, e.g. paragraph or div structure
  */
  focusedResourceid: PropTypes.string,
  /**
  * resource id of current section
  */
  resourceid: PropTypes.string,
  /**
  * title of current section
  */
  title: PropTypes.string,
  /**
  * hide entire outline
  */
  hidden: PropTypes.bool,
  /**
  * manifestation and transcription slug
  * used to create links in outline to specific manifestation
  * or transcription

  */
  mtFocus: PropTypes.string,
  /**
  * indicates if section heading should be bold with string "bold", indicating that focusedResourceId falls within this section

  * TODO: "bold" value would be better as boolean, true false
  */
  bold: PropTypes.string,
  /**
  * indicates whether children should be shown
  */
  showChildren: PropTypes.bool,
  /**
  * indicates whether level of section with number as string

  * TODO: would be better if level propType was number.
  */
  level: PropTypes.string,
  /**
  * indicates structureType of current section (e.g. collection, item, division, block)
  */
  structureType: PropTypes.string,
  /**
  * an array of ids, that focused section is a member of
  */
  membersOf: PropTypes.array,
  /**
  * question title associated with section
  */
  questionTitle: PropTypes.string,
  /**
  * indications whether a link at the collection level should be set or not
  */
  collectionLink: PropTypes.bool
}

export default TextOutline;
