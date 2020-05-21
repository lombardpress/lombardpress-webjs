import React from 'react';
import ReactDOM from 'react-dom';
import TextPreviewWrapper from '../components/TextPreviewWrapper';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<TextPreviewWrapper />, div);
  ReactDOM.unmountComponentAtNode(div);
});
