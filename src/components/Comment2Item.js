import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {FaTrash, FaEdit, FaClipboard} from 'react-icons/fa';
import Comment2Create from './Comment2Create.js'
import {useTranslation} from 'react-i18next'
import {copyToClipboard} from './utils'

function Comment2Item(props) {
  const {t} = useTranslation();
  const [editable, setEditable] = useState(false);
  
  const submitUpdate = (update, motivation, editedText, selectionRange, orderNumber, noTarget, inputTags) => {
    props.updateComment(props.comment.id, update, editedText, motivation, selectionRange, orderNumber, noTarget, inputTags)
    setEditable(false)
  }
  const addSCTALinksToValue = (value) => {
    // conversion template source: http://talkerscode.com/webtricks/convert-url-text-into-clickable-html-links-using-javascript.php 
    const link = value.match(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/ig)
    if (link){
      const firstString = value.split(link[0])[0]
      let strings = [firstString]
      link.forEach((l, i) => {
        const linkComponent = <Link key={l} to={"/res?resourceid=" + l}>{l}</Link> 
        const linkCopy = <span key={"s-" + l} className="lbp-span-link" title="Copy Resource Url Clipboard" onClick={(e) => {e.preventDefault(); copyToClipboard(l)}}><FaClipboard /></span>
        strings.push(linkComponent)
        strings.push(linkCopy)
        const afterString = value.split(l)[1]
        const prunedString = afterString.split(link[i+1])[0]
        strings.push(prunedString)
      })
      return strings
    }
    else{
      return value
    }
  }
  
  
  let target =  typeof(props.comment.target) === 'string' ? props.comment.target : props.comment.target.source;
  

  let selectedFragment = undefined;
  let selectedFragmentRange = undefined;
  if (props.comment.target.selector){
    selectedFragment = props.comment.target.selector.filter((i) => (i.type === "TextQuoteSelector"))[0].exact;
    selectedFragmentRange = props.comment.target.selector.filter((i) => (i.type === "TextPositionSelector"))[0];
    //selectedCharacterRange = props.comment.target.selector.filter((i) => (i.type === "TextPositionSelector"))[0];
    target = selectedFragmentRange.start ? target + "@" + selectedFragmentRange.start + "-" + selectedFragmentRange.end : target;

  }
  
  const selectionRange = {
    text: selectedFragment, 
    textEdited: props.comment.body.editedValue,
    wordRange: selectedFragmentRange
  }

  const getTagsWithOrderNumbers = (annoid, tags) => {
    const tagsWithOrder = []
    if (Object.keys(props.tagsList).length > 0){
      tags && Object.keys(tags).forEach((t) => {
      const orderNumber = getTagOrderNumber(annoid, t)
      const fullTag = orderNumber ? t + ":" + orderNumber : t
      tagsWithOrder.push(fullTag)
    })
    }
    return tagsWithOrder // should return array
  }
  const getTagOrderNumber = (annoid, t) => {
    const annoShortId = annoid.replace("http://inbox.scta.info/notifications/", "sctan:")
    if (props.tagsList[t] && props.tagsList[t][annoShortId] && props.tagsList[t][annoShortId].order) {
      return props.tagsList[t][annoShortId].order
    }
    else{
      return null
    }
  }
  const displayTags = (tags) => {
    if (Object.keys(props.tagsList).length > 0){
    const displayTags = tags && Object.keys(tags).map((t) => {
      const orderNumber = getTagOrderNumber(props.comment.id, t)
      return (<span className="lbp-span-link" onClick={() => props.setTagFilter(t)}>{t} {orderNumber && <span>({orderNumber})</span>} </span>)
    })
    return displayTags
    }
    else{
      return null
    }
  }
  
  return (
      <div>
        {/* {!props.focused && <p>{t("For")}: <Link to={"/text?resourceid=" + target}>{target}</Link></p>} */}
        {/* <span className="lbp-span-link" onClick={() => props.handleOnClickComment(target.split("/resource/")[1], selectedFragment, props.comment.body.editedValue, selectedFragmentRange, selectedCharacterRange)}>{target} {selectedFragmentRange && <span> ({selectedFragmentRange.start}-{selectedFragmentRange.end})</span>}</span> */}
        
        <p>{t("For")}: <Link to={"/text?resourceid=" + target}>{target}</Link></p>
        {
          editable ?
          <Comment2Create submitComment={submitUpdate} 
          comment={props.comment.body.value} 
          selectionRange={selectionRange} 
          motivation={props.comment.motivation}
          noTarget={props.comment.target ? false : true}
          orderNumber={props.orderNumber}
          tags={getTagsWithOrderNumbers(props.comment.id, props.comment.tags)}
          /> :
          <p>
          {
          //<span dangerouslySetInnerHTML={{ __html: addSCTALinksToValue(props.comment.body.value)}}/>
          }
          {selectedFragment && <span>Comment on: <i>{selectedFragment}</i></span>}
          <br/>
          {props.comment.motivation === "editing" && <span>Suggested Correction: {props.comment.body.editedValue}<br/></span>}
          
          <span>{addSCTALinksToValue(props.comment.body.value)}</span>
          <br/>
          <span>Tags: {displayTags(props.comment.tags)}</span>
          <br/>
          <span>Submitted: </span> {props.comment.created && props.comment.created.split("T")[0]} | 
          <span className="lbp-span-link" onClick={() => {props.removeComment(props.comment.id)}}><FaTrash/> </span> | 
          <span className="lbp-span-link" onClick={() => setEditable(true)}> <FaEdit/></span>
          </p>
        }
        <hr/>
      </div>
    );
}

export default Comment2Item;
