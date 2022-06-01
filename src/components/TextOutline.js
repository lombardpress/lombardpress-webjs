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
    this.mounted = ""
    this.state = {
      parts: [],
      showChildren: false,
      isPartOf: {}
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
          level: d.level ? d.level.value : "",
          author: d.author ? d.author.value : "",
          authorTitle: d.authorTitle ? d.authorTitle.value : "",
          structureType: d.structureType ? d.structureType.value : "",
          questionTitle: d.questionTitle ? d.questionTitle.value : ""
        }
      })

      let isPartOf = {isPartOfId: "", isPartOfTitle: ""}
      if (data.data.results.bindings[0]){
        if (data.data.results.bindings[0].isPartOf){
        isPartOf.isPartOfId = data.data.results.bindings[0].isPartOf.value
        isPartOf.isPartOfTitle = data.data.results.bindings[0].isPartOfTitle.value
        }
      }


      if (this.mounted){
        this.setState({parts: newData, isPartOf: isPartOf})
      }
    })
  }
  componentDidMount(){
    //this.setState({showChildren: this.props.showChildren})
    this.mounted = true;
    this.retrieveParts(this.props.resourceid)
    
    if (this.props.membersOf){
      if (this.props.membersOf.includes(this.props.resourceid)) {
        this.setState({showChildren: true})

      }
    }

  }
  // UNSAFE_componentWillReceiveProps(newProps){
  //   if (newProps.resourceid !== this.props.resourceid){
  //     this.retrieveParts(this.props.resourceid)
  //   }
  //   if (newProps.resourceid !== this.props.resourceid || newProps.membersOf !== this.props.membersOf){
  //     if (newProps.membersOf){
  //       if (newProps.membersOf.includes(newProps.resourceid)) {
  //         this.setState({showChildren: true})
  //       }
  //       // else{
  //       //   this.setState({showChildren: false})
  //       // }
  //     }
  //   }

  // }
  componentDidUpdate(prevProps){
    if (this.props.resourceid !== prevProps.resourceid){
      this.retrieveParts(this.props.resourceid)
    }
    if (this.props.resourceid !== prevProps.resourceid || this.props.membersOf !== prevProps.membersOf){
      if (this.props.membersOf){
        if (this.props.membersOf.includes(this.props.resourceid)) {
          this.setState({showChildren: true})
        }
        // else{
        //   this.setState({showChildren: false})
        // }
      }
    }

  }
  componentWillUnmount(){
    this.mounted = false;
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
        showFirstLevelChildren={false}
        resourceid={p.part}
        title={p.title}
        level={p.level}
        author={p.author}
        authorTitle={p.authorTitle}
        structureType={p.structureType}
        membersOf={this.props.membersOf}
        questionTitle={p.questionTitle}
        mtFocus={this.props.mtFocus}
        showAuthor={this.props.showAuthor}
        collectionLink={p.structureType === "http://scta.info/resource/structureCollection" ? this.props.collectionLink : false}
        showParentLink={false}
        />


      })
      return parts
    }
    const indent = this.props.level * 5
    return (
      <div id="outline" style={{"paddingLeft": indent + "px"}}>
        <p className={this.props.bold}>
        {(this.state.isPartOf.isPartOfId && this.props.showParentLink) && <Link to={"/text?resourceid=" + this.state.isPartOf.isPartOfId}><FaChevronUp/></Link>}
        {(this.props.author && this.props.showAuthor && this.props.level === "1") &&
          <span>
            <span>{this.props.authorTitle}: </span>
            <Link to={"/text?resourceid=" + this.props.author}><FaExternalLinkAlt/></Link>
          </span>
        }
        {this.props.title}
        {this.props.questionTitle && <span>: {this.props.questionTitle}</span>}
        
        {!this.props.showFirstLevelChildren &&
        <>
        {(this.state.parts.length > 0 && !this.state.showChildren) && <span className="outlineArrow" onClick={this.handleToggleChildren}><FaChevronDown/></span>}
        {(this.state.parts.length > 0 && this.state.showChildren) && <span className="outlineArrow" onClick={this.handleToggleChildren}><FaChevronUp/></span>}
        </>
        }
        
        {/** Note this conditional below ("this.props.resourceid &&"") was added mostly to allow current tests to pass; if required documentation of required props is improved; tests could be improved and this conditional likely wouldn't be necessary */}
        {this.props.resourceid && <Link to={"/text?resourceid=" + this.props.resourceid + this.props.mtFocus} ><FaExternalLinkAlt/></Link>}
        {this.props.collectionLink && <a href={"https://mirador.scta.info?resourceid=" + this.props.resourceid} target="_blank" rel="noopener noreferrer"> <img alt="view in mirador" style={{width: "12px", height: "12px"}} src="https://projectmirador.org/img/mirador-logo.svg"></img></a>}
        </p>
        {this.props.showFirstLevelChildren ? displayChildren() : this.state.showChildren && displayChildren()}
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
