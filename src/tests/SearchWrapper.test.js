import React from 'react';
import ReactDOM from 'react-dom';
import SearchWrapper from '../components/SearchWrapper';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<SearchWrapper />, div);
  ReactDOM.unmountComponentAtNode(div);
});
