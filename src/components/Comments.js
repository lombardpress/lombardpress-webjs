import React from 'react';
import PropTypes from 'prop-types';
import Axios from 'axios';
import uuidv4 from 'uuid/v4';

import Container from 'react-bootstrap/Container';

import CommentItem from "./CommentItem"
import CommentCreate from "./CommentCreate"

class Comments extends React.Component {
  constructor(props){
  super(props)
  this.handleSumbitComment = this.handleSumbitComment.bind(this)
  this.state = {
    notifications: [],
    inbox: "",
    resourceid: ""
  }
}
handleSumbitComment(comment){
  const _this = this;

  const randomid = uuidv4();
  const annotat = {
    "@context": "http://www.w3.org/ns/anno.jsonld",
    "id": "http://inbox.scta.info/notifications/" + randomid,
    "type": "Annotation",
    "motivation": "commenting",
    "body": {
      "type": "TextualBody",
      "value": comment
    },
    "target": this.state.resourceid
  }
  Axios({
    method: 'post',
    url: this.state.inbox,
    data: annotat,
    config: { headers: {'Content-Type': 'application/json+ld' }}
    })
    .then(function (response) {
      _this.setState((prevState) => {
        return {notifications: [annotat, ...prevState.notifications, ]}
      });
    })
    .catch(function (response) {
        //handle error
        console.log(response);
    });


  }
  retrieveComments(inbox){
    // using callback here to make sure state is set before making second a sync call.
    // TODO: consider using this in other components to prevent out of sync behavior
    // especially is TextCompareComponents
    this.setState({notifications: []}, function() {
      Axios.get(inbox).then((d) => {
        d.data["ldp:contains"].forEach((n) => {
          //TODO annoying that each comment has to be requestd.
          // if inbox main list included full comment, only one request would be needed
          Axios.get(n["@id"]).then((d2) => {
            this.setState((prevState) => {
              return {notifications: [...prevState.notifications, d2.data]}
            });
          });
        })
      }).catch((e) => {
        console.log(e)
      })
    })
  }
  componentDidMount(){
    // conditional prevents against needless attempt to retreive comments with info is not present
    if (this.props.resourceid){
      this.setState({inbox: this.props.inbox, resourceid: this.props.resourceid})
      this.retrieveComments(this.props.inbox)
    }
  }
  componentWillReceiveProps(newProps){
    // conditional prevents against needlessly rerequesting information when "info" is the same
    if (newProps.resourceid !== this.props.resourceid){
      this.setState({inbox: newProps.inbox, resourceid: newProps.resourceid})
      this.retrieveComments(newProps.inbox)
    }
  }
  render(){
    const displayComments = () => {
      const comments = this.state.notifications.map((n, i) => {
        if (n.motivation === "commenting"){
          return (
            <CommentItem key={"commenting-" + i} n={n}/>
          )
        }
        else{
          return null
        }
      })
      return comments
    }
    const displayDiscussions = () => {
      const comments = this.state.notifications.map((n, i) => {
        if (n.motivation === "discussing"){
          return (
            <CommentItem key={"discussion-" + i} n={n}/>
          )
        }
        else{
          return null
        }
      })
      return comments
    }
    return (
      <Container className={this.props.hidden ? "hidden" : "showing"}>
        <h1>Comments</h1>
        <CommentCreate handleSumbitComment={this.handleSumbitComment}/>
        <hr/>
        <div>
          <h4>Previous Comments</h4>
          {displayComments()}
        </div>
        <hr/>
        <div>
          <h4>Web Discussions/Quotations</h4>
          {displayDiscussions()}
        </div>
      </Container>
    );

  }
}

Comments.propTypes = {
  /**
  * resource id; comments will be assigned to this resourceid
  */
  resourceid: PropTypes.string.isRequired,
  /**
  * inbox;
  * IDEA: inbox url is currently required; but it is retrievable
  * just from the resource. Thus it would be good to be able to supply it if already known
  * but if it is not supplied the component should be able to look it up.
  */
  inbox: PropTypes.string.isRequired,
  /**
  * hidden designates whether the component should be hidden after mounting
  */
  hidden: PropTypes.bool
}

export default Comments;
