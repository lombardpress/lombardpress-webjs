import React from 'react';
import ReactDOM from 'react-dom';
//import './styles/index.scss';
import AppRouter from './components/AppRouter';
import * as serviceWorker from './serviceWorker';
import './i18n';
import './firebase/firebase';
import { firebase } from './firebase/firebase';

//ReactDOM.render(<AppRouter/>, document.getElementById('root'));


let hasRendered = false; 
const renderApp = (user) => {
  if (!hasRendered){
    ReactDOM.render(
      //<React.StrictMode> // commented out because it is causing setStates to run twice; but this should be a problem if my setState functions were pure functions as they should be; but apparently mine are not: see https://github.com/facebook/react/issues/12856#issuecomment-390206425
        <AppRouter user={user}/>,
      //</React.StrictMode>
      document.getElementById('root')
    );
    //hasRendered = true
  }
}

firebase.auth().onAuthStateChanged((user) => {
  if (user){
    console.log("log in")
    renderApp(user)
  }
  else {
    console.log("log out")
    const user = {uid: "jeff"}
    renderApp(user)
  }
})

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
