import React from 'react';
import ReactDOM from 'react-dom';
import Footer from '../components/Footer';
import {shallow} from 'enzyme'
import toJson from 'enzyme-to-json';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Footer />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('should render and conform to snapshot ', () => {
  const wrapper = shallow(<Footer/>)
  
  expect(toJson(wrapper)).toMatchSnapshot()
});

it('should shallow render and include Navbar as child', () => {
  const wrapper = shallow(<Footer/>)
  expect(wrapper.find('Navbar').length).toBe(1)
});