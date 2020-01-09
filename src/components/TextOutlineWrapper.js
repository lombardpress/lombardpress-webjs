import React from 'react';
import PropTypes from 'prop-types';
import TextOutline from './TextOutline'

import {runQuery} from './utils'
import {getMembersOf} from './Queries'

/**
* creates a text outline starting from top level expression

*/
class TextOutlineWrapper extends React.Component {
  constructor(props){
    super(props)
    this.mounted = ""
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
      if (this.mounted){
        this.setState({membersOf: newData})
      }
    })
  }
  componentDidMount(){
    this.mounted = true;
    this.retrieveMembersOf(this.props.focusResourceid)
  }
  componentWillReceiveProps(newProps){
    if (newProps.focusResourceid !== this.props.focusResourceid){
      this.retrieveMembersOf(newProps.focusResourceid)
    }
  }
  componentWillUnmount(){
    this.mounted = false;
}
  render(){
    return (
      <div className={this.props.hidden ? "hidden" : "showing"}>

        <TextOutline
          key={this.props.resourceid}
          showChildren={true}
          focusResourceid={this.props.focusResourceid}
          resourceid={this.props.resourceid}
          title={this.props.title}
          level={"1"}
          structureType={"http://scta.info/resource/structureCollection"}
          membersOf={this.state.membersOf}
          mtFocus={this.props.mtFocus}
          collectionLink={this.props.collectionLink}
          showAuthor={this.props.showAuthor}
          />
      </div>
    );
  }
}

TextOutlineWrapper.propTypes = {
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
  mtFoucs: PropTypes.string,
  /**
  * indications whether a link at the collection level should be set or not
  */
  collectionLink: PropTypes.bool
}
export default TextOutlineWrapper;
