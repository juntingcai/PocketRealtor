import React, { Fragment, useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import "./App.css";

import PropertyList from "./components/PropertyList";
import NaviBar from "./components/NaviBar";
import Home from "./components/Home";

import { Provider } from "react-redux";
import store from "./store";
import { loadUser } from "./actions/auth";
import setAuthToken from "./utils/setAuthToken";
import AuthDialog from "./components/Login/AuthDialog";
import PrivateRoute from "./components/PrivateRoute";
import SellList from "./components/SellProperties/SellList";
import CreateListing from "./components/SellProperties/CreateListing";
import Listing from "./components/listings/CreateListing";
import EditProfile from "./components/profile-forms/EditProfile";
import FindTenants from "./components/dashboard/Dashboard";
import CreateListingPage from "./components/listings/CreateListingPage";
import Property from './components/Property';
import SavedList from './components/SavedList';

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
                <PrivateRoute exact path="/myprofile" component={EditProfile} />
                <PrivateRoute exact path="/savedlist" component={SavedList} />
                <Route exact path="/property/:id" component={Property} />

                <Route path="/createlisting" component={Listing} />
                <Route path="/newlisting" component={CreateListingPage} />
                <Route path="/findtenants" component={FindTenants} />
                
              </Switch>
            </div>
            <AuthDialog />
          </div>
        </Fragment>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
