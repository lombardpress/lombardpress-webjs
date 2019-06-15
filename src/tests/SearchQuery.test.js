import React from 'react';
import ReactDOM from 'react-dom';
import SearchQuery from '../components/SearchQuery';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<SearchQuery />, div);
  ReactDOM.unmountComponentAtNode(div);
});
