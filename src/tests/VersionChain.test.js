import React from 'react';
import ReactDOM from 'react-dom';
import VersionChain from '../components/VersionChain';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<VersionChain />, div);
  ReactDOM.unmountComponentAtNode(div);
});
