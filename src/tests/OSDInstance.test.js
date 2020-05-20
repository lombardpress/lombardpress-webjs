import React from 'react';
import ReactDOM from 'react-dom';
import {shallow} from 'enzyme'

import OSDInstance from '../components/OSDInstance';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<OSDInstance imageurl="https://loris2.scta.info/vat/V145v.jpg"/>, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('should load and render two div (a wrapper parent and 1 child)', () => {
  const wrapper = shallow(<OSDInstance imageurl="https://loris2.scta.info/vat/V145v.jpg"/>)
  expect(wrapper.find('div').length).toBe(2)
});