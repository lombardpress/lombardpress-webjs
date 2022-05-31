import React, {useState, useEffect} from 'react';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import {useTranslation} from 'react-i18next'
import {FaEdit, FaComment} from 'react-icons/fa';

import Comments2TagSuggestions from './Comments2TagSuggestions'

function Comment2Create(props) {
  const {t} = useTranslation();
  const [comment, setComment] = useState(props.comment);
  const [motivation, setMotivation] = useState(props.motivation || "commenting") // "commenting" vs "editing"; default "commenting"
  const editedTextDefault = props.selectionRange && props.selectionRange.text ? props.selectionRange.text : ""
  const [editedText, setEditedText] = useState((props.selectionRange && props.selectionRange.textEdited) ? props.selectionRange.textEdited : editedTextDefault);
  const [noTarget, setNoTarget] = useState(props.noTarget || false); // if noTarget is set to true, annotation is made without a target
  const [orderNumber] = useState(props.orderNumber);
  const [inputTags, setInputTags] = useState(props.tagsList || []);
  
  
  const handleOnClickTag = (t) => {
    setInputTags([...inputTags, t])
  }
  const handleDropTag = (t) => {
    const newInputTags = inputTags.filter((ot) => {
      if (ot.split(":")[0] !== t.split(":")[0]){
        return ot
      }
      else{
        return null
      }
    })
    setInputTags(newInputTags)

  }
  const handleCommentUpdate = (e) => {
    e.preventDefault()
    const commentType = motivation;
    props.submitComment(comment, commentType, editedText, props.selectionRange, orderNumber, noTarget, inputTags)
    setComment('')
  }
  useEffect(() => {
    const editedTextDefault = props.selectionRange && props.selectionRange.text ? props.selectionRange.text : ""
    setEditedText((props.selectionRange && props.selectionRange.textEdited) ? props.selectionRange.textEdited : editedTextDefault)
  }, [props.selectionRange])
  useEffect(() => {
    if (motivation === "commenting"){
      setEditedText(props.selectionRange ? props.selectionRange.text : "")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [motivation])

  const wordRange = (props.selectionRange && props.selectionRange.wordRange) ? props.selectionRange.wordRange.start + "-" + props.selectionRange.wordRange.end : ""

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
        {(props.selectionRange && props.selectionRange.text) &&
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
        
        <span>Has Target: <input type="checkbox" inline="true" label="has target" checked={!noTarget} onChange={(e) => {setNoTarget(!noTarget)}} style={{display: "inline"}}/></span>
        <FormControl as="textarea" type="text" id="comment" rows="3" value={comment} placeholder={t("comment")} className="mr-sm-2" onChange={(e) => {setComment(e.target.value)}}/>
        {inputTags && <span>Selected Tags: {
          
          inputTags.map((t) => {
            return (<span key={"tag-"+ t}><span onClick={() => {handleDropTag(t)}}>X</span><span>{t}</span></span>)
          })
        }
        </span>
        }
        <Comments2TagSuggestions tagsList={props.availableTagsList} handleOnClickTag={handleOnClickTag} placeHolderText="add tags (e.g beauty, faith:1, faith:2); type ? to see in-use tags"/>

      </div>
      <Button size="sm"  type="submit" block style={{margin: "2px"}}>{t("Submit")}</Button>
   </Form>
  );
}

export default Comment2Create;
