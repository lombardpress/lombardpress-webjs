import React from 'react';
import ReactDOM from 'react-dom';
import NextPrevBar from '../components/NextPrevBar';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<NextPrevBar />, div);
  ReactDOM.unmountComponentAtNode(div);
});
