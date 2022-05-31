import React, {useState} from 'react';
import FormControl from 'react-bootstrap/FormControl';

function Comments2TagSuggestions(props) {
  const [tagFilter, setTagFilter] = useState("")

  const handleOnClickTag = (t) => {
    setTagFilter("")
    props.handleOnClickTag(t)
  }
  const displayTagSuggestions = (tags) => {
    const possibleTags = Object.keys(tags).map((t) => {
      if (tagFilter === "?"){
        return (<span onClick={(() => handleOnClickTag(t))} key={"tsuggest-" + t}>{t}</span>)
      }
      else if (t.toLowerCase().includes(tagFilter.toLowerCase())){
        return (<span onClick={(() => handleOnClickTag(t))} key={"tsuggest-" + t}>{t}</span>)
      }
      else {
        return null
      }
    })
    return possibleTags
  }
  const handelOnEnterPress = (e) => {
    if (e.charCode === 13) {
      props.handleOnClickTag(e.target.value)
      setTagFilter("")
    }
  }
  return(
    <div>
          <FormControl size="sm" type="text" value={tagFilter} placeholder={props.placeHolderText} className="mr-sm-2" onChange={(e) => {setTagFilter(e.target.value)}} onKeyPress={((e) => {handelOnEnterPress(e)})}/>
          {tagFilter && <div className="tagSuggestionList">{displayTagSuggestions(props.tagsList)}</div>}
        </div>
  )
}
  export default Comments2TagSuggestions;