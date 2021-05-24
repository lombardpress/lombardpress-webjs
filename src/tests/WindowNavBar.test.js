import React from 'react';
import ReactDOM from 'react-dom';
import WindowNavBar from '../components/Window/WindowNavBar';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<WindowNavBar />, div);
  ReactDOM.unmountComponentAtNode(div);
});
