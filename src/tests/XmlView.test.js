import React from 'react';
import ReactDOM from 'react-dom';
import XmlView from '../components/XmlView';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<XmlView />, div);
  ReactDOM.unmountComponentAtNode(div);
});
