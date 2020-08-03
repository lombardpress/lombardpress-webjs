import React, {useState} from 'react';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import {useTranslation} from 'react-i18next'

function Comment2Create(props) {
  const {t} = useTranslation();
  const [comment, setComment] = useState(props.comment);
  const handleCommentUpdate = (e) => {
    e.preventDefault()
    props.submitComment(comment)
    setComment('')
  }

  return (
    <Form onSubmit={handleCommentUpdate}>
      {props.selectedFragmentEditable && 
      <div>
        <span>Suggest Edit: </span> 
        <FormControl as="textarea" type="text" id="comment" rows="3" 
        value={props.selectedFragment} placeholder={t("comment")} className="mr-sm-2" onChange={(e) => {setComment(e.target.value)}}/>
      </div>
      }
      <div>
        {props.selectedFragmentEditable ? <span>Leave comment on edit</span> : <span>Comment on: <i>{props.selectedFragment}</i></span>}
        <FormControl as="textarea" type="text" id="comment" rows="3" value={comment} placeholder={t("comment")} className="mr-sm-2" onChange={(e) => {setComment(e.target.value)}}/>
      </div>
      <Button size="sm"  type="submit" block style={{margin: "2px"}}>{t("Submit")}</Button>
   </Form>
  );
}

export default Comment2Create;
