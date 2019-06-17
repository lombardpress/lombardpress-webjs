import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import NavBar from '../components/NavBar';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<HashRouter><NavBar /></HashRouter>, div);
  ReactDOM.unmountComponentAtNode(div);
});
