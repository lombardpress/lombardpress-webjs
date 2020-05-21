import React from 'react';
import ReactDOM from 'react-dom';
import TextOutlineWrapper from '../components/TextOutlineWrapper';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<TextOutlineWrapper />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<TextOutlineWrapper focusedResourceid="http://scta.info/resource/plaoulcommentary"/>, div);
  ReactDOM.unmountComponentAtNode(div);
});
