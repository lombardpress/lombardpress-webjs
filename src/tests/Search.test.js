import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import Search from '../components/Search';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<HashRouter><Search /></HashRouter>, div);
  ReactDOM.unmountComponentAtNode(div);
});
