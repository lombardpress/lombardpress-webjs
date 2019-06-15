import React from 'react';
import ReactDOM from 'react-dom';
import TextCompareWrapper from '../components/TextCompareWrapper';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<TextCompareWrapper />, div);
  ReactDOM.unmountComponentAtNode(div);
});
