import React, {useState, useEffect} from 'react';
import Container from 'react-bootstrap/Container';
import FormControl from 'react-bootstrap/FormControl';
import Comment2Create from './Comment2Create.js'
import Comment2Item from './Comment2Item.js'
import uuidv4 from 'uuid/v4';
import Button from 'react-bootstrap/Button';

function Comments2(props) {
  const [comments, setComments] = useState(JSON.parse(localStorage.getItem("sctaCommentsState")) || []);
  const [showFocusComments, setShowFocusComments] = useState(true)
  const [commentFilter, setCommentFilter] = useState("")
  const submitComment = (comment) => {
    const randomid = uuidv4();
    const annoId = "http://inbox.scta.info/notifications/" + randomid
    const dateObject = new Date()
    const annotation = {
      "@context": "http://www.w3.org/ns/anno.jsonld",
      "id": "http://localhost/annotation/" + randomid,
      "type": "Annotation",
      "created": dateObject.toISOString(),
      "motivation": "commenting",
      "body": {
        "type": "TextualBody",
        "value": comment
      },
      "target": props.resourceid
    }
    setComments([
      ...comments,
      annotation
    ])
    setCommentFilter('')
  }
  const removeComment = (id) => {
    setComments(comments.filter((c) => (c.id !== id)))
  }
  const updateComment = (id, update) => {
    const targetComment = comments.filter((c) => (c.id === id))[0]
    targetComment.body.value = update
    setComments([...comments])
  }

  useEffect(() => {
    localStorage.setItem("sctaCommentsState", JSON.stringify(comments))
  })
  return (
    <Container className={props.hidden ? "hidden" : "showing"}>
      <Comment2Create submitComment={submitComment}/>
      <FormControl style={{margin: "10px 0"}} type="text" value={commentFilter} placeholder="filter comments by text" className="mr-sm-2" onChange={(e) => {setCommentFilter(e.target.value)}}/>
      <Button style={{margin: "10px 0"}} block onClick={() => setShowFocusComments(!showFocusComments)}>{showFocusComments ? "Show All Comments" : "Show Comments For Focused Passage" }</Button>

      <div>
        {comments.slice(0).reverse().map((c,i) => {
          if (showFocusComments){
            if (c.target === props.resourceid && c.body.value.includes(commentFilter)){
              return (
                <div key={i}>
                  <Comment2Item comment={c} focused={true} removeComment={removeComment} updateComment={updateComment}/>
                  {
                  //<button onClick={() => {removeNote(n.title)}}>x</button>
                  }
                </div>
              )
            }
          }
          else{
            if (c.target === props.resourceid && c.body.value.includes(commentFilter)){
              return (
                <div key={i} style={{borderLeft: "1px solid black"}}>
                  <Comment2Item comment={c} removeComment={removeComment} updateComment={updateComment}/>
                  {
                  //<button onClick={() => {removeNote(n.title)}}>x</button>
                  }
                </div>
              )
            }
            else if (c.body.value.includes(commentFilter)){
              return (
                <div key={i}>
                  <Comment2Item comment={c} removeComment={removeComment} updateComment={updateComment}/>
                  {
                  //<button onClick={() => {removeNote(n.title)}}>x</button>
                  }
                </div>
              )
            }
          }
        })}
      </div>

    </Container>
  );
}

export default Comments2;
