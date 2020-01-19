import React from 'react';
import ReactDOM from 'react-dom';
import TextCompareWrapper from '../components/TextCompareWrapper';

it('renders without crashing', () => {
  const div = document.createElement('div');
  const info = {
    resourceid: "http://scta.info/resource/l1-cpspfs"
  }
  ReactDOM.render(<TextCompareWrapper info={info}/>, div);
  ReactDOM.unmountComponentAtNode(div);
});
