import React, {Suspense, useState} from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Home from "./Home"
import Search3 from "./Search3"
import TextSwitch from "./TextSwitch"
import About from "./About"
import NavBar from './NavBar';
import Spinner from './Spinner';
import Footer from './Footer';
import OSDInstance from './OSDInstance';

import 'bootstrap/dist/css/bootstrap.css'
import '../styles/App.scss';
//import '../styles/index.scss';

const AppRouter = () => {
  const [userId, setUserId] = useState("jeff")
  const handleUserIdUpdate  = (uid) => {
    setUserId(uid)
  }
  
  return (
  <Suspense fallback={<Spinner/>}>
    <BrowserRouter forceRefresh={false}>
      <div>
        <NavBar handleUserIdUpdate={handleUserIdUpdate}/>
        <Switch>
          <Route path="/" exact={true} render={(props) => <Home {...props} userId={userId}/>}/>
          <Route path="/res" exact={true} render={(props) => <TextSwitch {...props} userId={userId}/>}/>
          <Route path="/text"  exact={true} render={(props) => <TextSwitch {...props} userId={userId}/>}/>
          <Route path="/about" exact={true} render={(props) => <About {...props} userId={userId}/>}/>
          <Route path="/search" exact={true} render={(props) => <Search3 {...props} userId={userId}/>}/>
          <Route path="/osd" exact={true} render={(props) => <TextSwitch {...props} userId={userId}/>}/>
          {
            //<Route path="/edit/:id" exact={true} component={EditExpensePage}/>
          //<Route path="/help" exact={true} component={HelpPage}/>
          // <Route component={NotFoundPage}/>
          }
        </Switch>
        <Footer/>
      </div>
    </BrowserRouter>
  </Suspense>
)
}

export default AppRouter
