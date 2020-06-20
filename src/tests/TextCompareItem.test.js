import React from 'react';
import ReactDOM from 'react-dom';
import {shallow} from 'enzyme'
import toJson from 'enzyme-to-json';

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
// testing state change behavior
it('set states and displays raw text when showCompare is changed to False', () => {
  const wrapper = shallow(<TextCompareItem 
    base="circa prologum sententiarum in quo magister dicit quod intentionis suae est munire davidicam turrim vel potius munitam ostendere clypeis etc quaero istam quaestionem utrum in causa iudiciali fidei contra traditionem pure humanitus adinventam iudex idoneus ferret pro fide sententiam"
    compareTranscription="http://scta.info/resource/l1-cpspfs/reims/transcription"
    manifestationTitle="Paragraph l1-cpspfs/reims"
    show={false}
    showCompare={true}
    />)
    wrapper.setState({
      showCompare: true,
      compareText: "circa prologum sententiarum in quo magister dicit quod intentionis suae est munire davidicam turrim vel potius munitam ostendere clypeis etc quaero istam quaestionem utrum in causa iudiciali fidei contra traditionem pure humanitus adinventam iudex idoneus ferret pro fide sententiam",
      rawText: "TEST Circa prologum sententiarum in quo magister dicit quod intentionis suae est munire davidicam turrim vel potius munitam ostendere clypeis etc quaero istam quaestionem utrum in causa iudiciali fidei contra traditionem pure humanitus adinventam iudex idoneus ferret pro fide sententiam",
      show: true,
      showCompare: false,
      levenshteinDistance: undefined, 
      usedBase: "circa prologum sententiarum in quo magister dicit quod intentionis suae est munire davidicam turrim vel potius munitam ostendere clypeis etc quaero istam quaestionem utrum in causa iudiciali fidei contra traditionem pure humanitus adinventam iudex idoneus ferret pro fide sententiam",
      usedCompareTranscription: "http://scta.info/resource/l1-cpspfs/reims/transcription"
    })
    expect(toJson(wrapper)).toMatchSnapshot()
});
it('set states and displays compare text when showCompare is changed to true', () => {
  const wrapper = shallow(<TextCompareItem 
    base="circa prologum sententiarum in quo magister dicit quod intentionis suae est munire davidicam turrim vel potius munitam ostendere clypeis etc quaero istam quaestionem utrum in causa iudiciali fidei contra traditionem pure humanitus adinventam iudex idoneus ferret pro fide sententiam"
    compareTranscription="http://scta.info/resource/l1-cpspfs/reims/transcription"
    manifestationTitle="Paragraph l1-cpspfs/reims"
    show={false}
    showCompare={false}
    />)
    wrapper.setState({
      showCompare: true,
      compareText: "circa prologum sententiarum in quo magister dicit quod intentionis suae est munire davidicam turrim vel potius munitam ostendere clypeis etc quaero istam quaestionem utrum in causa iudiciali fidei contra traditionem pure humanitus adinventam iudex idoneus ferret pro fide sententiam",
      rawText: "TEST Circa prologum sententiarum in quo magister dicit quod intentionis suae est munire davidicam turrim vel potius munitam ostendere clypeis etc quaero istam quaestionem utrum in causa iudiciali fidei contra traditionem pure humanitus adinventam iudex idoneus ferret pro fide sententiam",
      show: true,
      showCompare: true,
      levenshteinDistance: undefined, 
      usedBase: "circa prologum sententiarum in quo magister dicit quod intentionis suae est munire davidicam turrim vel potius munitam ostendere clypeis etc quaero istam quaestionem utrum in causa iudiciali fidei contra traditionem pure humanitus adinventam iudex idoneus ferret pro fide sententiam",
      usedCompareTranscription: "http://scta.info/resource/l1-cpspfs/reims/transcription"
    })
    expect(toJson(wrapper)).toMatchSnapshot()
});
