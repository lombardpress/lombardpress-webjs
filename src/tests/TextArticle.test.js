import React from 'react';
import ReactDOM from 'react-dom';
import TextArticle from '../components/TextArticle';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<TextArticle />, div);
  ReactDOM.unmountComponentAtNode(div);
});

