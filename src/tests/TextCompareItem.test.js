import React from 'react';
import ReactDOM from 'react-dom';
import TextCompareItem from '../components/TextCompareItem';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<TextCompareItem />, div);
  ReactDOM.unmountComponentAtNode(div);
});
