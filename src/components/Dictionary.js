import React, {useState} from 'react';
import Nav from 'react-bootstrap/Nav';
import {FaBook} from 'react-icons/fa';

function Dictionary(props) {
  const [dictionary, setDictionary] = useState("logeion")

  return (
    <div className={props.hidden ? "hidden dict-container" : "showing dict-container"} >
      {/* commented out because whitaker's words does not run over https and therefore is not accessible as iframe on https sites<Nav>
        {(dictionary === 'whitakerswords') ? 
        <Nav.Link title="select logeion" onClick={()=>setDictionary("logeion")}><FaBook/> Logeion</Nav.Link>
        : 
        <Nav.Link title="select whitaker's words" onClick={()=>setDictionary("whitakerswords")}><FaBook/> Whitaker's Words</Nav.Link>}
      </Nav> */}
      {(props.text && props.text.split(" ").length === 1) && 
      <div className="dict-container2">
        {
        dictionary === "logeion" ? <iframe className="dict-iframe" title="logeion" src={"https://logeion.uchicago.edu/" + props.text }></iframe> 
        : 
        <iframe className="dict-iframe" title="whitakerswords" src={"http://archives.nd.edu/cgi-bin/wordz.pl?keyword=" + props.text }></iframe> 
        }
        </div>
      }
    </div>

    
  );
}

export default Dictionary;