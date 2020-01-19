import React from 'react';
import ReactDOM from 'react-dom';
import Collection from '../components/Collection';
import {HashRouter} from 'react-router-dom';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<HashRouter><Collection /></HashRouter>, div);
  ReactDOM.unmountComponentAtNode(div);
});
