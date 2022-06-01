import React, {useState} from 'react';
import FormControl from 'react-bootstrap/FormControl';
import { FaAngleLeft, FaAngleRight, FaAngleUp} from 'react-icons/fa';
import Nav from 'react-bootstrap/Nav';

function NextPrevBar(props) {
  const [customResourceTarget, setCustomResourceTarget] = useState("")
  const [showCustomResourceTarget, setShowCustomResourceTarget] = useState(false)
  const handleUpArrow = () => {
    if (props.selectionRange && props.selectionRange.wordRange){
      props.handleBlockFocusChange(props.info.resourceid)
    }
    else{
      props.handleBlockFocusChange(props.info.parent)
    }
  }
  const getTitle = () => {
    if (props.selectionRange && props.selectionRange.wordRange){
      return props.info.title + "@" + props.selectionRange.wordRange.start + "-" + props.selectionRange.wordRange.end
    }
    else{
      return props.info.title
    }
  }
  const handelOnEnterPress = (e) => {
    if (e.charCode === 13) {
      let target = e.target.value
      if (target.includes("https://scta.info/resource/")){
        target = target.replace("https://scta.info/resource/", "http://scta.info/resource/")
      }
      else if (target.includes("sctar:")){
        target = target.replace("sctar:", "http://scta.info/resource/")
      }
      else if (target.includes("http://scta.info/resource/")){

      }
      else(
        target = "http://scta.info/resource/" + target
      )
      props.handleFocusChange(target)
      setCustomResourceTarget("")
      //setShowCustomResourceTarget(false)
    }
  }
  const displayNextPrevBar = () => {
    if (props.info){
      return (
        <Nav variant="tabs">
        <Nav.Link onClick={() => {props.handleBlockFocusChange(props.info.resourceid)}}>{getTitle()}</Nav.Link>
        <Nav.Item>
          {(props.info.previous && props.info.previous !== "http://scta.info/resource/")  && <Nav.Link title="Move Up to Previous Sibling Resource" onClick={() => {props.handleBlockFocusChange(props.info.previous)}}><FaAngleLeft/></Nav.Link>}
        </Nav.Item>
        <Nav.Item>
          {(props.info.next && props.info.next !== "http://scta.info/resource/") && <Nav.Link title="Move Up to Next Sibling Resource" onClick={() => {props.handleBlockFocusChange(props.info.next)}}><FaAngleRight/></Nav.Link>}
        </Nav.Item>
        <Nav.Item>
          {(props.info.resourceid !== props.info.topLevel) && (props.info.parent !== "http://scta.info/resource/") 
          && <Nav.Link title="Move Up to Parent Resource" onClick={handleUpArrow}><FaAngleUp/></Nav.Link>}
        </Nav.Item>
        {showCustomResourceTarget ? 
          <div style={{display: 'flex', justifyContent: "space-between", width: "100%"}}>
            <Nav.Item><Nav.Link><span onClick={() => {setShowCustomResourceTarget(false)}}><FaAngleUp/></span></Nav.Link></Nav.Item>
            <FormControl style={{width: "90%"}} type="text" value={customResourceTarget} placeholder="supply scta resource id" className="mr-sm-2" onKeyPress={((e) => {handelOnEnterPress(e)})} onChange={(e) => {setCustomResourceTarget(e.target.value)}}/>
          </div>
          :
          <Nav.Item onClick={() => {setShowCustomResourceTarget(true)}}><Nav.Link>Go to: <FaAngleRight/></Nav.Link></Nav.Item>
        }
        </Nav>
        
      )
    }
    else{
      return null
    }
  }
  return (
    displayNextPrevBar()
  );
}

export default NextPrevBar;
