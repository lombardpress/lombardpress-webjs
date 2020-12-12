import React from 'react';
import ReactDOM from 'react-dom';
import TextWrapper from '../components/TextWrapper';
import {HashRouter} from 'react-router-dom';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<HashRouter><TextWrapper /></HashRouter>, div);
  ReactDOM.unmountComponentAtNode(div);
});
