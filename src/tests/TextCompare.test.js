import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import TextCompare from '../components/TextCompare';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<HashRouter>
    <TextCompare 
    expressionid="http://scta.info/resource/l1-pqeqra" 
    info={{resourceid: "http://scta.info/resource/l1-pqeqra"}}/>
    </HashRouter>, div);
  ReactDOM.unmountComponentAtNode(div);
});
