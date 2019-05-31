import React from 'react';
import {NavLink} from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';


class TextNavBar extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      next: "",
      previous: ""
    }
  }
  componentWillReceiveProps(nextProps){
    this.setState({next: nextProps.next, previous: nextProps.previous})
  }
  render(){
    console.log("textnavbar", this)
    return (
      <Navbar bg="light" variant="light" expand="lg" fixed="bottom">
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
        <Nav>
          {this.props.previous && <NavLink className="nav-link" to={"/text?resourceid=" + this.props.previous}>Previous</NavLink>}
          {this.props.next && <NavLink className="nav-link" to={"/text?resourceid=" + this.props.next}>Next</NavLink>}
          {this.props.next && <NavLink className="nav-link" to={"/text?resourceid=" + this.props.topLevel}>Text Home</NavLink>}
          <a className="nav-link" onClick={() => {this.props.handleClose("sideWindow")}}>Toggle Side Window</a>
          <a className="nav-link" onClick={() => {this.props.handleClose("bottomWindow")}}>Toggle Bottom Window</a>

        </Nav>
        </Navbar.Collapse>
      </Navbar>

    );
  }
}

export default TextNavBar;
