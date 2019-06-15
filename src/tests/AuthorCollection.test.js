import React from 'react';
import ReactDOM from 'react-dom';
import AuthorCollection from '../components/AuthorCollection';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<AuthorCollection />, div);
  ReactDOM.unmountComponentAtNode(div);
});
