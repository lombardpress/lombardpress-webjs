import React from 'react';
import ReactDOM from 'react-dom';
import Surface2 from '../components/Surface2';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Surface2 />, div);
  ReactDOM.unmountComponentAtNode(div);
});
