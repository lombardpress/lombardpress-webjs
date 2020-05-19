import React from 'react';
import ReactDOM from 'react-dom';
import Footer from '../components/Footer';
import {shallow} from 'enzyme'

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Footer />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('should shallow render and include Navbar as child', () => {
  const wrapper = shallow(<Footer/>)
  expect(wrapper.find('Navbar').length).toBe(1)
});