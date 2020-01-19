import React from 'react';
import ReactDOM from 'react-dom';
import Home from '../components/Home';
import {HashRouter} from 'react-router-dom';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<HashRouter><Home /></HashRouter>, div);
  ReactDOM.unmountComponentAtNode(div);
});
