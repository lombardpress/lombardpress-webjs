import React, {useState, useEffect} from 'react';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import {useTranslation} from 'react-i18next'

function Comment2Create(props) {
  const {t} = useTranslation();
  const [comment, setComment] = useState(props.comment);
  const [editedText, setEditedText] = useState(props.selectionRange.editable ? props.selectionRange.text : "");
  const handleCommentUpdate = (e) => {
    e.preventDefault()
    const commentType = props.selectionRange.editable ? "editing" : "commenting"
    props.submitComment(comment, commentType, editedText, props.selectionRange)
    setComment('')
  }
  useEffect(() => {
    setEditedText(props.selectionRange.editable ? props.selectionRange.text : "")
  }, [props.selectionRange])

  const wordRange = props.selectionRange.wordRange ? props.selectionRange.wordRange.start + "-" + props.selectionRange.wordRange.end : ""
  return (
    <Form onSubmit={handleCommentUpdate}>
      {props.selectionRange.editable && 
      <div>
        <span>Suggest Edit for : <i>{props.selectionRange.text}</i> {wordRange}</span> 
        <FormControl as="textarea" type="text" id="editedText" rows="3" 
        value={editedText} placeholder={t("comment")} className="mr-sm-2" onChange={(e) => {setEditedText(e.target.value)}}/>
      </div>
      }
      <div>
        {props.selectionRange.editable ? <span>Leave comment on edit</span> : <span>Comment on: <i>{props.selectionRange.text}</i> {wordRange}</span>}
        <FormControl as="textarea" type="text" id="comment" rows="3" value={comment} placeholder={t("comment")} className="mr-sm-2" onChange={(e) => {setComment(e.target.value)}}/>
      </div>
      <Button size="sm"  type="submit" block style={{margin: "2px"}}>{t("Submit")}</Button>
   </Form>
  );
}

export default Comment2Create;
