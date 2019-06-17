import React from 'react';
import Axios from 'axios'
import uuidv4 from 'uuid/v4'

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
        //handle success
        console.log(response);
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
            console.log("d2", d2)
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
    if (this.props.info){
      this.setState({inbox: this.props.info.inbox, resourceid: this.props.info.resourceid})
      this.retrieveComments(this.props.info.inbox)
    }
  }
  componentWillReceiveProps(newProps){
    // conditional prevents against needlessly rerequesting information when "info" is the same
    if (newProps.info != this.props.info){
      this.setState({inbox: newProps.info.inbox, resourceid: newProps.info.resourceid})
      this.retrieveComments(newProps.info.inbox)
    }
  }
  render(){
    const displayComments = () => {
      const comments = this.state.notifications.map((n, i) => {
        return (
          <CommentItem key={i} n={n}/>
        )
      })
      return comments
    }
    return (
      <div className={this.props.hidden ? "hidden" : "showing"}>
        <h1>Comments</h1>
        <CommentCreate handleSumbitComment={this.handleSumbitComment}/>
        {displayComments()}
      </div>
    );

  }




}

export default Comments;
