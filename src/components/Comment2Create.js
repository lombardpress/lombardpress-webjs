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
     <FormControl type="text" id="comment" value={comment} placeholder={t("comment")} className="mr-sm-2" onChange={(e) => {setComment(e.target.value)}}/>
     <hr/>
     <Button type="submit" block>{t("Submit")}</Button>
   </Form>
  );
}

export default Comment2Create;
