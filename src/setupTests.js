// TODO: Not sure why these comments are here; 
// TODO: might be just examples for create-react-app. they should probably be deleted
// const config = {
//   transformIgnorePatterns: [
//       '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx)$',
//       '^.+\\.module\\.(css|sass|scss)$',
//       '^react-syntax-highlighter'
//     ]
//   }
// const config = {
//   transformIgnorePatterns: [
//      "/node_modules/(?!(react-syntax-highlighter)/)"
//    ]
//  }

import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

// NOTEThis import is required to allow just to test the "html canvas" component invoked by OSDInstance
// see https://stackoverflow.com/questions/48828759/unit-test-raises-error-because-of-getcontext-is-not-implemented
// and https://github.com/hustcc/jest-canvas-mock
import 'jest-canvas-mock';

Enzyme.configure({
  adapter: new Adapter()
})