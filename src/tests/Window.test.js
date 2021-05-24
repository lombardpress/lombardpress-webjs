import React from 'react';
import ReactDOM from 'react-dom';
import Window from '../components/Window/Window';
import {HashRouter} from 'react-router-dom';

it('renders without crashing', () => {
  const div = document.createElement('div');
  const info = {
    resourceid: "http://scta.info/resource/l1-cpspfs"
  }
  ReactDOM.render(<HashRouter><Window info={info}/></HashRouter>, div);
  ReactDOM.unmountComponentAtNode(div);
});
