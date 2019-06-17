import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import TextCompare from '../components/TextCompare';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<HashRouter><TextCompare /></HashRouter>, div);
  ReactDOM.unmountComponentAtNode(div);
});
