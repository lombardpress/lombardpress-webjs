import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import FormControl from 'react-bootstrap/FormControl';
import PropTypes from 'prop-types';
import Comment2Create from './Comment2Create.js'
import Comment2Item from './Comment2Item.js'
import Comments2ImportExport from './Comments2ImportExport'
import uuidv4 from 'uuid/v4';
import Button from 'react-bootstrap/Button';
import {FaClipboard} from 'react-icons/fa';
import {useTranslation} from 'react-i18next'
import {copyToClipboard} from './utils'

/**
 * 
 * A comment wrapper for submitting comments to local storage
 * 
 */

function Comments2(props) {
  const {t} = useTranslation();
  const [lists, setLists] = useState(JSON.parse(localStorage.getItem("sctaCommentsState2"))|| {"local": []})
  const [comments, setComments] = useState("local");
  const [showFocusComments, setShowFocusComments] = useState(true)
  const [commentFilter, setCommentFilter] = useState("")
  const [mentionedBy, setMentionedBy] = useState([])
  
  

  /**
   * submit the comment
   * 
   * @param {string} comment 
   * @public
   */
  const submitComment = (comment) => {
    const randomid = uuidv4();
    const annoId = "http://inbox.scta.info/notifications/" + randomid
    const dateObject = new Date()
    const annotation = {
      "@context": "http://www.w3.org/ns/anno.jsonld",
      "id": annoId,
      "type": "Annotation",
      "created": dateObject.toISOString(),
      "motivation": "commenting",
      "body": {
        "type": "TextualBody",
        "value": comment
      },
      "target": props.resourceid
    }
    console.log("test", lists[comments])
    lists[comments].push(annotation) 
    
    setLists({
      ...lists,
    })
    setCommentFilter('')
  }
  const removeComment = (id) => {
    //filter current list
    const newLists = lists[comments].filter((c) => (c.id !== id))
    // replace current list value with filtered list
    lists[comments] = newLists
      setLists({
        ...lists
      })
  }
  const updateComment = (id, update) => {
    
    const targetComment = lists[comments].filter((c) => (c.id == id))[0]
    targetComment.body.value = update
    setLists({
      ...lists
    })
  }
  useEffect(() => {
    setMentionedBy(getMentionedBy())

  }, [props.resourceid])
  
  const getMentionedBy = () => {
    if (lists[comments].length > 0){
      let mentionedBy = lists[comments].map((c) => {
        if (c.body.value.includes(props.resourceid)){
          return c.target
        }
      })
      mentionedBy = mentionedBy.filter((i) => {return i !== undefined})
      return mentionedBy
    }
    else{
      return []
    }
  }
  // expect list to be in already parsed JSON
  const handleImportList = (list, listname) => {
    // try to load data from local storage
    try {
      const parsedList = list;
      const name = listname || uuidv4();
      lists[name] = parsedList
      setLists({
        ...lists
      })
    }
    // if import update fails do nothing and proceed with the default state
    catch (e) {
      console.log("error", e)
    }
  }

  useEffect(() => {
    localStorage.setItem("sctaCommentsState2", JSON.stringify(lists))
  })

  return (
    <Container className={props.hidden ? "hidden" : "showing"}>
      <Comment2Create submitComment={submitComment}/>
      <FormControl style={{margin: "10px 0"}} type="text" value={commentFilter} placeholder={t("filter comments by text")} className="mr-sm-2" onChange={(e) => {setCommentFilter(e.target.value)}}/>
      <Button style={{margin: "10px 0"}} block onClick={() => setShowFocusComments(!showFocusComments)}>{showFocusComments ? t("Show All Comments") : t("Show Comments For Focused Passage") }</Button>
      <FormControl as="select" onChange={(e) => {setComments(e.target.value)}} value={comments}>
                {lists && Object.keys(lists).map((e, i) => {
                    return (<option key={e} value={e}>{e}</option>)
                  })
                }
      </FormControl>
      {mentionedBy.length > 0 && 
      <div>
        <span>Discussed By:</span>
        {mentionedBy.map((m) => {
            return(
              <div>
              <Link key={m} to={"/res?resourceid=" + m}>{m}</Link>
              <span className="lbp-span-link" title="Copy Resource Url Clipboard" onClick={(e) => {e.preventDefault(); copyToClipboard(m)}}><FaClipboard /></span>
              </div>
            )
          })
          }
      </div>
      }
      <div>
        {lists[comments].length > 0 && lists[comments].slice(0).reverse().map((c,i) => {
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
            else{
              return null
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
            else{
              return null
            }
          }
        })}
      </div>
      {
      <Comments2ImportExport currentList={lists[comments]} currentListName={comments} handleImportList={handleImportList} />
    }

    </Container>
  );
}

Comments2.propTypes = {
  /**
  * 
  * resourceid to serve as target of annotation
  *
  */
  resourceid: PropTypes.string.isRequired,

}

export default Comments2;
