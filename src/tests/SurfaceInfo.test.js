import React from 'react';
import ReactDOM from 'react-dom';
import SurfaceInfo from '../components/SurfaceInfo';


it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<SurfaceInfo surfaceid="http://scta.info/resource/vat/100r" />, div);
  ReactDOM.unmountComponentAtNode(div);
});

