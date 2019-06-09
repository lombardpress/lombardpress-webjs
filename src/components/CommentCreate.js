import React from 'react';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';

class CommentCreate extends React.Component {
  constructor(props){
    super(props)
    this.handleCommentUpdate = this.handleCommentUpdate.bind(this)
    this.handleSubmitComment = this.handleSubmitComment.bind(this)
    this.state = {
      comment: ""
    }
  }
  handleCommentUpdate(e){
    e.preventDefault()
    this.setState({comment: e.target.value})

  }
  handleSubmitComment(e){
    e.preventDefault()
    this.props.handleSumbitComment(this.state.comment)
  }
  render(){
    return (
      <div className="comment">
        <Form onSubmit={this.handleSubmitComment}>
         <FormControl type="text" id="comment" placeholder="comment" className="mr-sm-2" onChange={this.handleCommentUpdate} />
         <Button type="submit" variant="outline-success">Search</Button>
       </Form>
      </div>
    );
  }
}

export default CommentCreate;
