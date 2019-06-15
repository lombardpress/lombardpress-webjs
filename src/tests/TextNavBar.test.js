import React from 'react';
import ReactDOM from 'react-dom';
import TextNavBar from '../components/TextNavBar';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<TextNavBar />, div);
  ReactDOM.unmountComponentAtNode(div);
});
