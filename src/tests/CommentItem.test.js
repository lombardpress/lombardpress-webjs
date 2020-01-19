import React from 'react';
import ReactDOM from 'react-dom';
import CommentItem from '../components/CommentItem';

it('renders without crashing', () => {
  const div = document.createElement('div');
  const comment = {
    "@context": "http://www.w3.org/ns/anno.jsonld",
    "id": "http://inbox.scta.info/notifications/test",
    "type": "Annotation",
    "motivation": "commenting",
    "body": {
      "type": "TextualBody",
      "value": "comment goes here"
    },
    "target": "test"
  }
  ReactDOM.render(<CommentItem n={comment}/>, div);
  ReactDOM.unmountComponentAtNode(div);
});
