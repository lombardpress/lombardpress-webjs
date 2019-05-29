import React from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';





function Footer() {
  return (
    <Container className="lbp-footer" fluid>
    <Row>
    <Col>
    <p>Designed by <a href="http://jeffreycwitt.com">Jeffrey C. Witt</a></p>
    </Col>
    <Col>
    <p>A <a href="http://lombardpress.org">LombardPress</a> Publication</p>
    </Col>
    <Col>
    <p>Powered by <a href="http://scta.info">SCTA</a> Data</p>
    </Col>
    </Row>
    </Container>

  );
}

export default Footer;
