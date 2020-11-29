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
import EditProfile from "./components/profile-forms/EditProfile";
import FindTenants from "./components/tenants/Tenants";
import Messages from './components/ChatRoom/Messages';
import Property from './components/Property';
import SavedList from './components/SavedList';
import SocketProvider from "./context/SocketProvider";
import { AlertProvider } from "./context/AlertProvider";
import ConversationsProvider from "./context/ConversationsProvider";
import CreateListingPage from './components/listings/CreateListingPage';
import CreateListing from './components/listings/CreateListing';
import GroupDashboard from "./components/groups/GroupDashboard";
import CreateGroup from "./components/groups/CreateGroup";
import HostTimeslots from "./components/schedule/HostTimeslots";
import NotificationDashboard from "./components/notifications/NotificationDashboard";

if (localStorage.token) {
  const token = JSON.parse(localStorage.getItem('token'));
  setAuthToken(token.token);
}

function App() {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);
  return (
    <Provider store={store}>
      <BrowserRouter>
        <SocketProvider>
          <AlertProvider>
            <ConversationsProvider>
              <Fragment>
                <div className="App">
                  <NaviBar />
                  <div className="body-wrap">
                    <Switch>
                      <Route exact path="/" component={Home} />
                      <Route exact path="/list" component={PropertyList} />
                      <PrivateRoute exact path="/createlisting" component={CreateListingPage} />

                      <PrivateRoute exact path="/sell" component={CreateListing} />
                      <PrivateRoute exact path="/findtenants" component={FindTenants} />
                      <PrivateRoute exact path="/myprofile" component={EditProfile} />
                      <PrivateRoute exact path="/savedlist" component={SavedList} />
                      <Route exact path="/property/:id" component={Property} />
                      <PrivateRoute exact path="/messages" component={Messages} />
                      <PrivateRoute path="/mygroup" component={GroupDashboard} />
                      <PrivateRoute path="/creategroup" component={CreateGroup} />
                      <Route path="/timeslots" component={HostTimeslots} />
                      <PrivateRoute path="/notifications" component={NotificationDashboard} />

                      {/* <Route path="/createlisting" component={Listing} />
                <Route path="/newlisting" component={CreateListingPage} />
                <Route path="/findtenants" component={FindTenants} /> */}

                    </Switch>
                  </div>
                  <AuthDialog />
                </div>
              </Fragment>
            </ConversationsProvider>
          </AlertProvider>
        </SocketProvider>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
