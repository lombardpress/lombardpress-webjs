import React, {useState, useEffect} from 'react';
import {runQuery} from './utils'
import {getExpressionTypeInfo} from '../queries/expressionTypeQuery'
import TextOutlineWrapper from "./TextOutlineWrapper"
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Search3 from './Search3';

const ExpressionType = (props) => {
  const [expressions, setExpressions] = useState([])
  useEffect(()=> {
    const results = runQuery(getExpressionTypeInfo(props.expressionTypeId))
    results.then((d) => {
      const bindings = d.data.results.bindings
      setExpressions(bindings)
    })
  }, [props.expressionTypeId])
  return (
    <Container className="collectionBody">
      <h1>{props.expressionTypeId}</h1>
      <Row>
        <Col xs={9}>
      {expressions.map((e)=> {
        return (
          <Container>
          <TextOutlineWrapper
          focusResourceid={e.expression.value}
          resourceid={e.expression.value}
          title={e.authorTitle ? e.authorTitle.value + ", " + e.eLongTitle.value : e.eLongTitle.value }
          hidden={false}
          mtFocus={""}
          collectionLink={true}
          showParentLink={true}/>
          </Container>
        )
      })}
      </Col>
      <Col>
        <Search3
        searchEid={""}
        searchEType={props.expressionTypeId}
        showSubmit={true}
        showAdvancedParameters={true}
        showLabels={false}/>
      </Col>
    </Row>
  </Container>

  );
}

export default ExpressionType;
