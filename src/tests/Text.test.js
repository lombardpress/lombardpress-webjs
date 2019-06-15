import React from 'react';
import ReactDOM from 'react-dom';
import Text from '../components/Text';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Text />, div);
  ReactDOM.unmountComponentAtNode(div);
});
