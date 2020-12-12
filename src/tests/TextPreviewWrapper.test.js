import React from 'react';
import ReactDOM from 'react-dom';
import TextPreviewWrapper from '../components/TextPreviewWrapper';
import {HashRouter} from 'react-router-dom';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<HashRouter><TextPreviewWrapper /></HashRouter>, div);
  ReactDOM.unmountComponentAtNode(div);
});
