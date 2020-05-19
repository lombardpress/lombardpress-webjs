import React from 'react';
import ReactDOM from 'react-dom';
import {shallow} from 'enzyme'

import TextCompareItem from '../components/TextCompareItem';


it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<TextCompareItem />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('renders without crashing when props are present', () => {
  const div = document.createElement('div');
  ReactDOM.render(<TextCompareItem 
    base="circa prologum sententiarum in quo magister dicit quod intentionis suae est munire davidicam turrim vel potius munitam ostendere clypeis etc quaero istam quaestionem utrum in causa iudiciali fidei contra traditionem pure humanitus adinventam iudex idoneus ferret pro fide sententiam"
    compareTranscription="http://scta.info/resource/l1-cpspfs/reims/transcription"
    show={true}
    showCompare={true}
    />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('should show no children because prop show is set to false', () => {
  const wrapper = shallow(<TextCompareItem 
    base="circa prologum sententiarum in quo magister dicit quod intentionis suae est munire davidicam turrim vel potius munitam ostendere clypeis etc quaero istam quaestionem utrum in causa iudiciali fidei contra traditionem pure humanitus adinventam iudex idoneus ferret pro fide sententiam"
    compareTranscription="http://scta.info/resource/l1-cpspfs/reims/transcription"
    show={false}
    showCompare={true}
    />)
  expect(wrapper.find('div').length).toBe(0)
});

it('should immediately render with Spinner as async call is started', () => {
  const wrapper = shallow(<TextCompareItem 
    base="circa prologum sententiarum in quo magister dicit quod intentionis suae est munire davidicam turrim vel potius munitam ostendere clypeis etc quaero istam quaestionem utrum in causa iudiciali fidei contra traditionem pure humanitus adinventam iudex idoneus ferret pro fide sententiam"
    compareTranscription="http://scta.info/resource/l1-cpspfs/reims/transcription"
    show={true}
    showCompare={true}
    />)
  expect(wrapper.find('Spinner').length).toBe(1)
});
///TODO need test for after async call is finished; and spinner should be removed and replaced with div
