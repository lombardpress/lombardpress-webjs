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
import {db } from '../firebase/firebase'
import {camelCase} from './utils'


/**
 * 
 * A comment wrapper for submitting comments to local storage
 * 
 */

function Comments2(props) {
  const {t} = useTranslation();
  //const [lists, setLists] = useState(JSON.parse(localStorage.getItem("sctaCommentsState2"))|| {"local": []})
  const [lists, setLists] = useState({"local": []})
  const [comments, setComments] = useState(""); // tagFilter
  const [annotations, setAnnotations] = useState({})
  const [tags, setTags] = useState({})
  const [showFocusComments, setShowFocusComments] = useState(true)
  const [commentFilter, setCommentFilter] = useState("")
  const [mentionedBy, setMentionedBy] = useState([])
  //const [showFilters, setShowFilters] = useState(false)
  const [userId, setUserId] = useState("")

  
  
//retrieve annotations on mount
useEffect(()=>{
  setUserId(props.userId)
    db.ref(props.userId)
      .once('value')
      .then((snapshot) => {
        const dbResult = snapshot.val()
        if (dbResult) {
          setAnnotations(dbResult.annotations || {})
          setTags(dbResult.tags || {})
        }
        else {
          setAnnotations({})
          setTags({})
        }
      })
    }, [props.userId])


  

  const generateTagList = (inputTags, akey) => {
    const tagsPerComment = inputTags.map((t) => {
      return t.split(":")[0]
    })
    // loop through tags and create hash of tag to order, so that the tag order can be looked up
    const tagsOrderMap = {}
    inputTags.forEach((t) => {
      const order = t.split(":")[1]
      const tagid = t.split(":")[0]
      tagsOrderMap[tagid] = order ? parseInt(order) : false
    })

     //const tagsBlock = {}
     const tagsNewList = {...tags}
    
     tagsPerComment.forEach((t) => {
       //tagsBlock[t] = true
       // if the tag already exists
       if (tagsNewList[t]){
         // if this new entry has an order, then bump the order of all following annos
         if (tagsOrderMap[t]){
           //const renumberingCounter = tagsOrderMap[t]
           Object.keys(tagsNewList[t]).forEach((nt) => {
             if (tagsNewList[t][nt].order && tagsNewList[t][nt].order >= tagsOrderMap[t]){
               tagsNewList[t][nt].order = tagsNewList[t][nt].order + 1
             }
           })
         }
         // then add new entry
         tagsNewList[t][akey] = tagsOrderMap[t] ? {order: tagsOrderMap[t]} : true
         
       }
       else{
         tagsNewList[t] = {}
         tagsNewList[t][akey] =  tagsOrderMap[t] ? {order: tagsOrderMap[t]} : true
       }
     })
     return tagsNewList

  }
  
  // 
  const generateAnnoTagBlock = (inputTags) => {
    const tagsPerComment = inputTags.map((t) => {
      return t.split(":")[0]
    })
    const tagsBlock = {}
    tagsPerComment.forEach((t) => {
      tagsBlock[t] = true
    })
    return tagsBlock
  }

  /**
   * submit the comment
   * 
   * @param {string} comment 
   * @public
   */
  const submitComment = (comment, motivation, editedText, selectionRange, orderNumber, noTarget, inputTags) => {
    const randomid = uuidv4();
    const annoId = "http://inbox.scta.info/notifications/" + randomid
    const akey = prefixedId(annoId)
    const dateObject = new Date();
    const userId = "http://scta.info/resource/jeffreycwitt" //TODO; needs to adjust to user logged in info
    
    const tagsNewList = generateTagList(inputTags, akey)
    
      const selector = [
      {
        "type": "TextQuoteSelector",
        "exact": selectionRange.text ? selectionRange.text : ""
      },
      {
        "type": "TextPositionSelector",
        "start": selectionRange.wordRange ? selectionRange.wordRange.start : "",
        "end": selectionRange.wordRange ? selectionRange.wordRange.end : ""
      }
    ]
    const annotation = {
      "@context": "http://www.w3.org/ns/anno.jsonld",
      "id": annoId,
      "type": "Annotation",
      "created": dateObject.toISOString(),
      "creator": userId,
      "motivation": motivation,
      "tags": generateAnnoTagBlock(inputTags),
      "body": {
        "type": "TextualBody",
        "value": comment
      },
      "target": !noTarget && { // changing target to object rather than string will break retrieval
        source: props.resourceid, 
        esource: "http://scta.info/resource/" + props.resourceid.split("/resource/")[1].split("/")[0],
        selector: selector
      }
      
    }
    // conditionally add editedValue only if motivation is editing
    if (motivation === "editing"){
      annotation.body.editedValue = editedText;
    }
    else {
      delete annotation.body["editedValue"];
    }
    setCommentFilter('')
    
    const annotationsNewList = {...annotations}
    annotationsNewList[akey] = annotation

    setAnnotations(annotationsNewList)
    setTags(tagsNewList)

  }
  const prefixedId = (id) => {
    const prefixedId = "sctan:" + id.split("/notifications/")[1]
    return prefixedId
  }
  const removeComment = (id) => {
    //filter current list
    
    let clonedAnnotations = { ...annotations};
    delete clonedAnnotations[prefixedId(id)]
    // replace current list value with filtered list
    setAnnotations(clonedAnnotations)
  }
  const updateComment = (id, update, editedText, motivation, selectionRange, orderNumber, noTarget, inputTags) => {
    let clonedAnnotations = { ...annotations};
    const targetComment = clonedAnnotations[prefixedId(id)]
    targetComment.body.value = update
    targetComment.body.editedValue = editedText
    targetComment.motivation = motivation
    //targetComment.orderNumber = orderNumber
    targetComment.target = noTarget ? false : targetComment.target
    targetComment.tags = generateAnnoTagBlock(inputTags)

    const akey = prefixedId(id)
    const tagsNewList = generateTagList(inputTags, akey)
    
    //const old_index = lists[comments].indexOf(targetComment);
    
    //reposition comment
    //see https://stackoverflow.com/questions/5306680/move-an-array-element-from-one-array-position-to-another
    //todo: this could/should be a utility function
    // if (orderNumber >= lists[comments].length) {
    //   var k = orderNumber - lists[comments].length + 1;
    //   while (k--) {
    //     lists[comments].push(undefined);
    //   }
    // }
    
    //lists[comments].splice(orderNumber, 0, lists[comments].splice(old_index, 1)[0]);
    
    setAnnotations(clonedAnnotations)
    setTags(tagsNewList)
  }
  useEffect(() => {
    setMentionedBy(getMentionedBy())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.resourceid])
  
  const getMentionedBy = () => {
    if (Object.keys(annotations).length > 0){
      console.log("firing2")
      let mentionedBy = Object.keys(annotations).map((c) => {
        if (annotations[c].body.value && annotations[c].body.value.includes(props.resourceid.split("/resource/")[1].split("/")[0])){
          const target =  typeof(annotations[c].target) === 'string' ? annotations[c].target : annotations[c].target.source;
          return target
        }
        else{
          return undefined
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
    //TODO; this would need to take in annotaitonList Array and convert it to object structure 
    // and then add it to annotationState which would then update db

    // try to load data from local storage
    try {
      const parsedList = list;
      const name = camelCase(listname) || uuidv4();
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
    //localStorage.setItem("sctaCommentsState2", JSON.stringify(lists))
    //NOTE/TODO: this conditional lists['local'].length > 0 is temporary and MUST BE changed
    // its currently there so that database won't be re-written on load, but it is completely acceptable for local to be 0
    // and this will prevent writing to other lists, when local list is empty
    // it is temporary to get db synch to work. 

    if (db && Object.keys(annotations).length > 0) {
      try{
        db.ref(userId).set({annotations: annotations, tags: tags})
      }
      catch (e){
        console.log("error in db update", e)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [annotations, lists, tags])
  // bug here; lists needs to be included or update won't happen

  // useEffect(() => {
  //   //localStorage.setItem("sctaCommentsState2", JSON.stringify(lists))
  //   //NOTE/TODO: this conditional lists['local'].length > 0 is temporary and MUST BE changed
  //   // its currently there so that database won't be re-written on load, but it is completely acceptable for local to be 0
  //   // and this will prevent writing to other lists, when local list is empty
  //   // it is temporary to get db synch to work. 

  //   if (db && tags && Object.keys(tags).length > 0) {
  //     console.log('firing tags', tags)
  //     db.ref("jeff").set({tags: tags})
  //   }
  // }, [tags])
  // bug here; lists needs to be included or update won't happen
  const generateFullList = () => {
    let fullList = []
    if (!comments){
       Object.keys(annotations).forEach((k) => {
         fullList.push(annotations[k])
      })
    }
    else{
      const newAnnotations = {...annotations}
      Object.keys(newAnnotations).map((a) => {
        if (tags && tags[comments] && Object.keys(tags[comments]).includes(a)) {
          if (tags[comments][a].order){
            newAnnotations[a]["order"] = tags[comments][a].order
          }
          return fullList.push(newAnnotations[a])
        }
        else {
          return null
        }
        
     })
     fullList.sort((a,b) => {
       if (a.order > b.order){
         return 1
       }
       else if (a.order < b.order){
         return -1
       }
       else {
         return 0
       }
       
      })
    }
    return fullList

  }
  
  const displayComments = () => {
    const fullList = generateFullList()

    const displayComments = fullList.length > 0 && fullList.slice(0).map((c,i) => {
      const target = typeof(c.target) === 'string' ? c.target : c.target.source;
      if (showFocusComments){
        if (target && target.includes(props.expressionid) && (c.body.value && c.body.value.includes(commentFilter))){
          return (
            <div key={i}>
              <Comment2Item comment={c} focused={true} removeComment={removeComment} updateComment={updateComment}
              handleOnClickComment={props.handleOnClickComment} setTagFilter={setComments} tagsList={tags}/>
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
        if (target && target.includes(props.expressionid) && (c.body.value && c.body.value.includes(commentFilter))){
          return (
            <div key={i} style={{borderLeft: "1px solid black"}}>
              <Comment2Item comment={c} removeComment={removeComment} updateComment={updateComment} setTagFilter={setComments} tagsList={tags}/>
              {
              //<button onClick={() => {removeNote(n.title)}}>x</button>
              }
            </div>
            )
        }
        else if (c.body.value && c.body.value.includes(commentFilter)){
          return (
            <div key={i}>
              <Comment2Item comment={c} removeComment={removeComment} updateComment={updateComment} setTagFilter={setComments} tagsList={tags}/>
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
    })
    return displayComments
  }
  return (
    <Container className={props.hidden ? "hidden" : "showing"}>
      {/* <LoginPage handleUserIdUpdate={handleUserIdUpdate}/> */}
      <Comment2Create 
        submitComment={submitComment} 
        selectionRange={props.selectionRange}
        textEdit={props.textEdit}
        orderNumber={Object.keys(annotations).length}
        />
      <hr/>
      {showFocusComments ? <Button size="sm" disabled>{t("Show Comments For Focused Passage")}</Button> : <Button id="btnAllCommentsToggle" size="sm" onClick={() => setShowFocusComments(true)}>{t("Show Comments For Focused Passage")}</Button>}
      {!showFocusComments ? <Button size="sm" disabled>Show Comments Regardless of Target</Button> : <Button id="btnAllCommentsToggle" size="sm" onClick={() => setShowFocusComments(false)}>Show Comments Regardless of Target</Button>}
      {comments && <><br/><span>Filter: <span onClick={() => {setComments("")}}>X</span><span>{comments}</span></span></>}
      <FormControl size="sm" style={{margin: "10px 0"}} type="text" value={commentFilter} placeholder={t("filter comments by text")} className="mr-sm-2" onChange={(e) => {setCommentFilter(e.target.value)}}/>
      
      <hr/>
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
        <hr/>
      </div>
      }
      <div>
        {displayComments()}
      </div>
      {
      <Comments2ImportExport currentList={generateFullList()} currentListName={comments || "all"} handleImportList={handleImportList} />
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
