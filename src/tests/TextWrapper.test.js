import React from 'react';
import ReactDOM from 'react-dom';
import TextWrapper from '../components/TextWrapper';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<TextWrapper />, div);
  ReactDOM.unmountComponentAtNode(div);
});
