import React from 'react';
import ReactDOM from 'react-dom';
import TextOutline from '../components/TextOutline';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<TextOutline />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<TextOutline focusedResourceid="http://scta.info/resource/plaoulcommentary"/>, div);
  ReactDOM.unmountComponentAtNode(div);
});
