import React from 'react';
import ReactDOM from 'react-dom';
import CommentItem from '../components/CommentItem';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<CommentItem />, div);
  ReactDOM.unmountComponentAtNode(div);
});
