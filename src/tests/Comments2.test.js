import React from 'react';
import ReactDOM from 'react-dom';
import Comments2 from '../components/Comments2';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Comments2 resourceid="http://scta.info/resource/lectio"/>, div);
  ReactDOM.unmountComponentAtNode(div);
});
