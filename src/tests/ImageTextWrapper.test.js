import React from 'react';
import ReactDOM from 'react-dom';
import ImageTextWrapper from '../components/ImageTextWrapper';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ImageTextWrapper />, div);
  ReactDOM.unmountComponentAtNode(div);
});
