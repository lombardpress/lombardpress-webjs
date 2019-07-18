import React from 'react';
import {HashRouter, Route, Switch} from 'react-router-dom';
import Home from "./Home"
import SearchWrapper from "./SearchWrapper"
import TextSwitch from "./TextSwitch"
import About from "./About"
import Codices from "./Codices"
import NavBar from './NavBar';



import Footer from './Footer';

import 'bootstrap/dist/css/bootstrap.css'
import '../styles/App.scss';
//import '../styles/index.scss';

const AppRouter = () => (
  <HashRouter forceRefresh={false}>
    <div>
      <NavBar/>
      <Switch>
        <Route path="/" exact={true} component={Home}/>
        <Route path="/text"  exact={true} component={TextSwitch}/>
        <Route path="/about" exact={true} component={About}/>
        <Route path="/codices" exact={true} component={Codices}/>
        <Route path="/search" exact={true} render={(props) => <SearchWrapper {...props} hidden={false}/>}/>
        {
          //<Route path="/edit/:id" exact={true} component={EditExpensePage}/>
        //<Route path="/help" exact={true} component={HelpPage}/>
        // <Route component={NotFoundPage}/>
        }
      </Switch>
      <Footer/>
    </div>
  </HashRouter>
)

export default AppRouter