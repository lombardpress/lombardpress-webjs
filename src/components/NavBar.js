import React from 'react';
import {NavLink} from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import {resourceEndpoint} from './config';
import {useTranslation} from 'react-i18next'

function NavBar() {
  const {t} = useTranslation();
  return (
    <Navbar bg="dark" variant="light" expand="lg" fixed="top">
      <Nav>
        <NavLink className="nav-link" to="/">{t("Title")}</NavLink>
      </Nav>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
      <Nav>



        <NavLink className="nav-link" to={"/res?resourceid=" + resourceEndpoint}>{t("Texts")}</NavLink>
        <NavLink className="nav-link" to={"/res?resourceid=http://scta.info/resource/person"}>{t("People")}</NavLink>
        <NavLink className="nav-link" to={"/res?resourceid=http://scta.info/resource/codex"}>{t("Codices")}</NavLink>
        {// example drop down
          // <NavDropdown title="Dropdown" id="basic-nav-dropdown">
        //   <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
        //   <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
        //   <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
        //   <NavDropdown.Divider />
        //   <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
        // </NavDropdown>
      }
      <NavLink className="nav-link" to="/search">{t("Search")}</NavLink>
      </Nav>

      <Nav>
        {
          //<NavLink className="nav-link" to="/about">{t("About")}</NavLink>
        }
        <a className="nav-link" href="https://scta.info/donate">{t("Donate")}</a>
      </Nav>
      </Navbar.Collapse>
    </Navbar>

  );
}

export default NavBar;
