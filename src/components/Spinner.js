import React from 'react';
import BSpinner from 'react-bootstrap/Spinner';

function Spinner() {
  return (
    <div className="spinner" style={{"padding": "20px 5px"}}>
      <BSpinner animation="grow" role="status">
        <span className="sr-only">Loading...</span>
      </BSpinner>
      <BSpinner animation="grow" variant="primary" />
      <BSpinner animation="grow" variant="secondary" />
      <BSpinner animation="grow" variant="success" />
      <BSpinner animation="grow" variant="danger" />
      <BSpinner animation="grow" variant="warning" />
      <BSpinner animation="grow" variant="info" />
    </div>
  );
}

export default Spinner;
