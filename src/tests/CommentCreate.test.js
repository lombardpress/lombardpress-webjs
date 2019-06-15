import React from 'react';
import ReactDOM from 'react-dom';
import CommentCreate from '../components/CommentCreate';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<CommentCreate />, div);
  ReactDOM.unmountComponentAtNode(div);
});
