import React, {useState, useEffect} from 'react';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import {useTranslation} from 'react-i18next'
import {FaEdit, FaComment} from 'react-icons/fa';

function Comment2Create(props) {
  const {t} = useTranslation();
  const [comment, setComment] = useState(props.comment);
  const [motivation, setMotivation] = useState(props.motivation || "commenting") // "commenting" vs "editing"; default "commenting"
  const [editedText, setEditedText] = useState(props.selectionRange.textEdited ? props.selectionRange.textEdited : props.selectionRange.text);
  
  const handleCommentUpdate = (e) => {
    e.preventDefault()
    const commentType = motivation;
    props.submitComment(comment, commentType, editedText, props.selectionRange)
    setComment('')
  }
  useEffect(() => {
    setEditedText(props.selectionRange.textEdited ? props.selectionRange.textEdited : props.selectionRange.text)
  }, [props.selectionRange])
  useEffect(() => {
    if (motivation === "commenting"){
      setEditedText(props.selectionRange.text)
    }
  }, [motivation])

  const wordRange = props.selectionRange.wordRange ? props.selectionRange.wordRange.start + "-" + props.selectionRange.wordRange.end : ""
  return (
    <Form onSubmit={handleCommentUpdate}>
      {motivation === "editing" && 
      <div>
        <span>Suggest Edit for : 
          <i>{props.selectionRange.text} </i> 
          <span className="lbp-span-link" title="leave simple comment on text" onClick={()=>{setMotivation("commenting")}}> <FaComment/> </span>
          <span> ({wordRange}) </span>
        </span> 
        <FormControl as="textarea" type="text" id="editedText" rows="3" 
        value={editedText} placeholder={t("comment")} className="mr-sm-2" onChange={(e) => {setEditedText(e.target.value)}}/>
      </div>
      }
        <div>
        {props.selectionRange.text &&
        <div>
        {motivation === "editing" ? 
        <span>Leave comment on edit</span> 
        : 
        <span>
          Comment on: 
          <i>{props.selectionRange.text} </i> 
          <span className="lbp-span-link" title="edit text" onClick={()=>{setMotivation("editing")}}> <FaEdit/> </span>
          <span> ({wordRange}) </span>
        </span>
        }
        </div>
        }
        <FormControl as="textarea" type="text" id="comment" rows="3" value={comment} placeholder={t("comment")} className="mr-sm-2" onChange={(e) => {setComment(e.target.value)}}/>
      </div>
      <Button size="sm"  type="submit" block style={{margin: "2px"}}>{t("Submit")}</Button>
   </Form>
  );
}

export default Comment2Create;
