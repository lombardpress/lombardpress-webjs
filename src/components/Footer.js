import React from 'react';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';





function Footer() {
  return (

    <Navbar bg="light" variant="light" expand="lg" fixed="bottom" style={{"zIndex": "0"}}>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">

    <Nav style={{"display": "flex", "justifyContent": "space-around", "width": "100%"}}>
      <Nav.Link href="http://github.com/lombardpress/lombardpress-webjs">Lbp-Web.js</Nav.Link>
      <Nav.Link href="http://lombardpress.org">A LombardPress Publication</Nav.Link>
      <Nav.Link href="http://scta.info">Powered by SCTA Data</Nav.Link>
      <Nav.Link href="http://jeffreycwitt.com">Designed by Jeffrey C. Witt</Nav.Link>
    </Nav>
    </Navbar.Collapse>

    </Navbar>

  );
}

export default Footer;
