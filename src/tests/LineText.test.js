import React from 'react';
import ReactDOM from 'react-dom';
import LineText from '../components/LineText';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<LineText />, div);
  ReactDOM.unmountComponentAtNode(div);
});
