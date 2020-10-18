import React, { Fragment, useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import './App.css';

import PropertyList from './components/PropertyList'
import NaviBar from './components/NaviBar'
import Home from './components/Home'
// import Register from './components/Login/Register'
import { Provider } from "react-redux";
import store from "./store";
import { loadUser } from "./actions/auth";
import setAuthToken from "./utils/setAuthToken";
import AuthDialog from './components/Login/AuthDialog';
import PrivateRoute from './components/PrivateRoute';
import SellList from './components/SellProperties/SellList';
import CreateListing from './components/SellProperties/CreateListing';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

function App() {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);
  return (
    <Provider store={store}>
    <BrowserRouter>
      <Fragment>

        <div className="App">
          <NaviBar />
          <div className="body-wrap">

            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/list" component={PropertyList} />
              <PrivateRoute exact path="/sell" component={SellList} />
              <PrivateRoute exact path="/creat" component={CreateListing} />
              
              
              
              {/* <Route exact path="/register" component={Register}/> */}
            </Switch>
          </div>
          <AuthDialog/>

        </div>
      </Fragment>


    </BrowserRouter>
    </Provider>


  );
}

export default App;
