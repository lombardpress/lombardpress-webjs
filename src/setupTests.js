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

Enzyme.configure({
  adapter: new Adapter()
})