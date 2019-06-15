import React from 'react';
import ReactDOM from 'react-dom';
import Window from '../components/Window';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Window />, div);
  ReactDOM.unmountComponentAtNode(div);
});
