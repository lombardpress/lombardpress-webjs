import React from 'react';
import ReactDOM from 'react-dom';

import {shallow, mount} from 'enzyme'
//import {shallow, mount} from 'enzyme'
//import sinon from 'sinon'

import XmlView from '../components/XmlView';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<XmlView tresourceid="http://scta.info/resource/l1-cpspfs"/>, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('should show 1 syntax highlighter child', () => {
  const wrapper = shallow(<XmlView tresourceid="http://scta.info/resource/l1-cpspfs"/>)
  expect(wrapper.find('SyntaxHighlighter').length).toBe(1)
});

//doesn't yet test that async call is successful and renders