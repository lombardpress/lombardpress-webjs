import React from 'react';
import ReactDOM from 'react-dom';
import TextCompare from '../components/TextCompare';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<TextCompare />, div);
  ReactDOM.unmountComponentAtNode(div);
});
