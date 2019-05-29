import React from 'react';
import {BrowserRouter, HashRouter, Route, Switch, Link, NavLink} from 'react-router-dom';
import Home from "./Home"
import Search from "./Search"
import Text from "./Text"
import About from "./About"
import NavBar from './NavBar';

import Footer from './Footer';

import 'bootstrap/dist/css/bootstrap.css'
import '../styles/App.scss';

const AppRouter = () => (
  <BrowserRouter forceRefresh={false}>
    <div>
      <NavBar/>
      <Switch>
        <Route path="/" exact={true} component={Home}/>
        <Route path="/text" exact={true} component={Text}/>
        <Route path="/about" exact={true} component={About}/>
        <Route path="/search" exact={true} component={Search}/>
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
