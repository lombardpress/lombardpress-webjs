import React from 'react';
import ReactDOM from 'react-dom';
import Print from '../components/Print';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Print url="https://github.com/scta-texts/plaoulcommentary/raw/master/lectio1/lectio1.xml"/>, div);
  ReactDOM.unmountComponentAtNode(div);
});
