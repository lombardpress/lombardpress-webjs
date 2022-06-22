import React from 'react';
import {NavLink} from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { withTranslation } from 'react-i18next';
import MemberBanner from "./MemberBanner"


const TextNavBar = (props) => {
  
    const { t } = props;
    return (
      <Navbar bg="light" variant="light" expand="lg" fixed="bottom">
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
        <Nav>
          {props.previous && <NavLink className="nav-link" to={"/text?resourceid=" + props.previous + props.mtFocus}>{t("Previous")}</NavLink>}
          {props.next && <NavLink className="nav-link" to={"/text?resourceid=" + props.next + props.mtFocus}>{t("Next")}</NavLink>}
          {props.topLevel && <NavLink className="nav-link" to={"/text?resourceid=" + props.topLevel}>{t("Text Home")}</NavLink>}
          {props.pdfView ? <span className="nav-link" onClick={()=>props.handleTogglePdfView()}>{t("Web View")}</span> : <span className="nav-link" onClick={()=>props.handleTogglePdfView()}>{t("Print View")}</span>}
          
        </Nav>
        </Navbar.Collapse>
        <MemberBanner/>
      </Navbar>

    );
}

export default withTranslation()(TextNavBar);
