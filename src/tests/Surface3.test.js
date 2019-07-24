import React from 'react';
import ReactDOM from 'react-dom';
import Surface3 from '../components/Surface3';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Surface3 />, div);
  ReactDOM.unmountComponentAtNode(div);
});
