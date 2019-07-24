import React from 'react';
import ReactDOM from 'react-dom';
import Surface3Wrapper from '../components/Surface3Wrapper';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Surface3Wrapper />, div);
  ReactDOM.unmountComponentAtNode(div);
});
