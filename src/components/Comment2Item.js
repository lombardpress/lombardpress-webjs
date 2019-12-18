import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {FaTrash, FaEdit} from 'react-icons/fa';
import FormControl from 'react-bootstrap/FormControl';
import Comment2Create from './Comment2Create.js'
import {useTranslation} from 'react-i18next'

function Comment2Item(props) {
  const {t, i18n} = useTranslation();
  const [editable, setEditable] = useState(false);

  const submitUpdate = (update) => {
    props.updateComment(props.comment.id, update)
    setEditable(false)
  }


  return (
      <div>
        {!props.focused && <p>{t("For")}: <Link to={"/text?resourceid=" + props.comment.target}>{props.comment.target}</Link></p>}

        {
          editable ?
          <Comment2Create submitComment={submitUpdate} comment={props.comment.body.value}/> :
          <p>
          <span>{props.comment.body.value}</span>
          | {props.comment.created && props.comment.created.split("T")[0]}
          | <span className="lbp-span-link" onClick={() => {props.removeComment(props.comment.id)}}>
              <FaTrash/>
            </span>
          | <span className="lbp-span-link" onClick={() => setEditable(true)}>
              <FaEdit/>
            </span>
          </p>
        }
        <hr/>
      </div>
    );
}

export default Comment2Item;
