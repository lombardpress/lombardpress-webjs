import React, {useState} from 'react';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';

function Comment2Create(props) {
  const [comment, setComment] = useState("");
  const handleCommentUpdate = (e) => {
    e.preventDefault()
    props.submitComment(comment)
  }

  return (
    <Form onSubmit={handleCommentUpdate}>
     <FormControl type="text" id="comment" value={comment} placeholder="comment" className="mr-sm-2" onChange={(e) => {setComment(e.target.value)}}/>
     <hr/>
     <Button type="submit" block>Submit</Button>
   </Form>
  );
}

export default Comment2Create;
