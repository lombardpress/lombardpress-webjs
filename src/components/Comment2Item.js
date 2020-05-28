import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {FaTrash, FaEdit} from 'react-icons/fa';
import Comment2Create from './Comment2Create.js'
import {useTranslation} from 'react-i18next'

function Comment2Item(props) {
  const {t} = useTranslation();
  const [editable, setEditable] = useState(false);
  

  const submitUpdate = (update) => {
    props.updateComment(props.comment.id, update)
    setEditable(false)
  }
  const addSCTALinksToValue = (value) => {
    // conversion template source: http://talkerscode.com/webtricks/convert-url-text-into-clickable-html-links-using-javascript.php 
    const exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
	  const text1=value.replace(exp, "<a href='/#/res?resourceid=$1'>$1</a>");
    console.log(text1)
    return text1 
  }
  
  


  return (
      <div>
        {!props.focused && <p>{t("For")}: <Link to={"/text?resourceid=" + props.comment.target}>{props.comment.target}</Link></p>}

        {
          editable ?
          <Comment2Create submitComment={submitUpdate} comment={props.comment.body.value}/> :
          <p>
          <span dangerouslySetInnerHTML={{ __html: addSCTALinksToValue(props.comment.body.value)}}/>
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
