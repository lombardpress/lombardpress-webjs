import React from 'react';
import ReactDOM from 'react-dom';
import TextSwitch from '../components/TextSwitch';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<TextSwitch />, div);
  ReactDOM.unmountComponentAtNode(div);
});
