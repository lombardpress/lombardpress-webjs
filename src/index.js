import React from 'react';
import ReactDOM from 'react-dom';
//import './styles/index.scss';
import AppRouter from './components/AppRouter';
import * as serviceWorker from './serviceWorker';
import './i18n';
import './firebase/firebase';
import { firebase } from './firebase/firebase';

ReactDOM.render(<AppRouter/>, document.getElementById('root'));

firebase.auth().onAuthStateChanged((user) => {
  if (user){
    console.log("log in")
  }
  else {
    console.log("log out")
  }
})

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
