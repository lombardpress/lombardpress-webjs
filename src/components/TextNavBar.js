import React from 'react';
import {NavLink} from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { withTranslation } from 'react-i18next';


class TextNavBar extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      next: "",
      previous: "",
      mtFocus: ""
    }
  }
  UNSAFE_componentWillReceiveProps(nextProps){
    this.setState({next: nextProps.next, previous: nextProps.previous, mtFocus: nextProps.mtFocus})
  }
  render(){
    const { t } = this.props;
    return (
      <Navbar bg="light" variant="light" expand="lg" fixed="bottom">
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
        <Nav>
          {this.props.previous && <NavLink className="nav-link" to={"/text?resourceid=" + this.props.previous + this.props.mtFocus}>{t("Previous")}</NavLink>}
          {this.props.next && <NavLink className="nav-link" to={"/text?resourceid=" + this.props.next + this.props.mtFocus}>{t("Next")}</NavLink>}
          {this.props.topLevel && <NavLink className="nav-link" to={"/text?resourceid=" + this.props.topLevel}>{t("Text Home")}</NavLink>}
          {this.props.pdfView ? <span className="nav-link" onClick={()=>this.props.handleTogglePdfView()}>{t("Web View")}</span> : <span className="nav-link" onClick={()=>this.props.handleTogglePdfView()}>{t("Print View")}</span>}
        </Nav>
        </Navbar.Collapse>
      </Navbar>

    );
  }
}

export default withTranslation()(TextNavBar);
