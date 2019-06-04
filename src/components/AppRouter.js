import React from 'react';
import {BrowserRouter, HashRouter, Route, Switch, Link, NavLink} from 'react-router-dom';
import Home from "./Home"
import SearchWrapper from "./SearchWrapper"
import Text from "./Text"
import TextSwitch from "./TextSwitch"
import About from "./About"
import NavBar from './NavBar';



import Footer from './Footer';

import 'bootstrap/dist/css/bootstrap.css'
import '../styles/App.scss';
//import '../styles/index.scss';

const AppRouter = () => (
  <BrowserRouter forceRefresh={false}>
    <div>
      <NavBar/>
      <Switch>
        <Route path="/" exact={true} component={Home}/>
        <Route path="/text"  exact={true} component={TextSwitch}/>
        <Route path="/about" exact={true} component={About}/>
        <Route path="/search" exact={true} render={(props) => <SearchWrapper {...props} hidden={false}/>}/>
        {
          //<Route path="/edit/:id" exact={true} component={EditExpensePage}/>
        //<Route path="/help" exact={true} component={HelpPage}/>
        // <Route component={NotFoundPage}/>
        }
      </Switch>
      <Footer/>
    </div>
  </BrowserRouter>
)

export default AppRouter
