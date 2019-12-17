import React, {useState, useEffect} from 'react';
import Container from 'react-bootstrap/Container';
import Comment2Create from './Comment2Create.js'
import Comment2Item from './Comment2Item.js'
import uuidv4 from 'uuid/v4';
import Button from 'react-bootstrap/Button';

function Comments2(props) {
  const [comments, setComments] = useState(JSON.parse(localStorage.getItem("sctaCommentsState")) || []);
  const [showFocusComments, setShowFocusComments] = useState(true)
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
  }
// sort by date example
// var array = [{id: 1, date:'Mar 12 2012 10:00:00 AM'}, {id: 2, date:'Mar 8 2012 08:00:00 AM'}];
//
//
// array.sort(function(a, b) {
//     var c = new Date(a.date);
//     var d = new Date(b.date);
//     return c-d;
// });

  useEffect(() => {
    localStorage.setItem("sctaCommentsState", JSON.stringify(comments))
  })
  return (
    <Container className={props.hidden ? "hidden" : "showing"}>
      <Comment2Create submitComment={submitComment}/>
      <Button style={{margin: "10px 0"}} block onClick={() => setShowFocusComments(!showFocusComments)}>{showFocusComments ? "Show All Comments" : "Show Comments For Focused Passage" }</Button>
      <div>
        {comments.slice(0).reverse().map((c,i) => {
          if (showFocusComments){
            if (c.target === props.resourceid){
              return (
                <div key={i}>
                  <Comment2Item comment={c} focused={true}/>
                  {
                  //<button onClick={() => {removeNote(n.title)}}>x</button>
                  }
                </div>
              )
            }
          }
          else{
            if (c.target === props.resourceid){
              return (
                <div key={i} style={{borderLeft: "1px solid black"}}>
                  <Comment2Item comment={c}/>
                  {
                  //<button onClick={() => {removeNote(n.title)}}>x</button>
                  }
                </div>
              )
            }
            else{
              return (
                <div key={i}>
                  <Comment2Item comment={c}/>
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
