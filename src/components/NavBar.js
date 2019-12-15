import React from 'react';
import {NavLink} from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import {resourceEndpoint} from './config';
import {useTranslation} from 'react-i18next'

function NavBar() {
  const {t, i18n} = useTranslation();
  return (
    <Navbar bg="dark" variant="light" expand="lg" fixed="top">
      <Nav>
        <NavLink className="nav-link" to="/">{t("Title")}</NavLink>
      </Nav>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
      <Nav>



        <NavLink className="nav-link" to={"/text?resourceid=" + resourceEndpoint}>{t("Text")}</NavLink>
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
        <NavLink className="nav-link" to="/about">{t("About")}</NavLink>
        <NavLink className="nav-link" to="/donate">{t("Donate")}</NavLink>
      </Nav>
      </Navbar.Collapse>
    </Navbar>

  );
}

export default NavBar;
