import React, {Suspense} from 'react';
import {HashRouter, Route, Switch} from 'react-router-dom';
import Home from "./Home"
import SearchWrapper from "./SearchWrapper"
import Search2 from "./Search2"
import Search3 from "./Search3"
import TextSwitch from "./TextSwitch"
import About from "./About"
import Codices from "./Codices"
import NavBar from './NavBar';



import Footer from './Footer';

import 'bootstrap/dist/css/bootstrap.css'
import '../styles/App.scss';
//import '../styles/index.scss';

const AppRouter = () => {
  return (
  <Suspense fallback='loading'>
    <HashRouter forceRefresh={false}>
      <div>
        <NavBar/>
        <Switch>
          <Route path="/" exact={true} component={Home}/>
          <Route path="/res" exact={true} component={TextSwitch}/>
          <Route path="/text"  exact={true} component={TextSwitch}/>
          <Route path="/about" exact={true} component={About}/>
          <Route path="/codices" exact={true} component={Codices}/>
          <Route path="/search" exact={true} render={(props) => <SearchWrapper {...props} hidden={false}/>}/>
          <Route path="/search2" exact={true} component={Search2}/>
          <Route path="/search3" exact={true} component={Search3}/>
          {
            //<Route path="/edit/:id" exact={true} component={EditExpensePage}/>
          //<Route path="/help" exact={true} component={HelpPage}/>
          // <Route component={NotFoundPage}/>
          }
        </Switch>
        <Footer/>
      </div>
    </HashRouter>
  </Suspense>
)
}

export default AppRouter
