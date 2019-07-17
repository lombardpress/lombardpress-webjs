import React from 'react';
import ReactDOM from 'react-dom';
import Citation from '../components/About';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Citation />, div);
  ReactDOM.unmountComponentAtNode(div);
});
