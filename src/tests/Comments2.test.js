import React from 'react';
import ReactDOM from 'react-dom';
import {shallow} from 'enzyme'
import toJson from 'enzyme-to-json';



import Comments2 from '../components/Comments2';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Comments2 resourceid="http://scta.info/resource/lectio1"/>, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('should render and conform to snapshot ', () => {
  //const comments2 = renderer.create(<Comments2 resourceid="http://scta.info/resource/lectio1"/>).toJSON();
  const comments2 = shallow(<Comments2 resourceid="http://scta.info/resource/lectio1"/>)
  expect(toJson(comments2)).toMatchSnapshot()
});

// TODO: test no longer works because hook showFilter is set to false, so button doesn't show up
// need to be able mock change hook showFilter in order to test again.
//it('tests to see if the button text changes when showFocusComments state toggles ', () => {
//   const comments2 = shallow(<Comments2 resourceid="http://scta.info/resource/lectio1"/>);
//   wrapper.setState({showFilters: true})
//   expect(comments2.find({id: 'btnAllCommentsToggle'}).text()).toEqual("Show All Comments");
//   comments2.find('Button').simulate('click');
//   expect(comments2.find({id: 'btnAllCommentsToggle'}).text()).toEqual("Show Comments For Focused Passage");
// });
