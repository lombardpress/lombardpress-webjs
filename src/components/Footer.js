import React from 'react';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import {useTranslation} from 'react-i18next'





function Footer() {
  const {t} = useTranslation();
  return (

    <Navbar bg="light" variant="light" expand="lg" fixed="bottom" style={{"zIndex": "1"}}>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">

    <Nav style={{"display": "flex", "justifyContent": "space-around", "width": "100%"}}>
      <Nav.Link href="http://github.com/lombardpress/lombardpress-webjs">Lbp-Web.js</Nav.Link>
      <Nav.Link href="http://lombardpress.org">{t("A LombardPress Publication")}</Nav.Link>
      <Nav.Link href="http://scta.info">{t("Powered by SCTA Data")} </Nav.Link>
      <Nav.Link href="http://jeffreycwitt.com">{t("Designed by Jeffrey C Witt")}</Nav.Link>
    </Nav>
    </Navbar.Collapse>

    </Navbar>

  );
}

export default Footer;
