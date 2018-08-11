import React from 'react';
import { Route, Router } from 'react-router-dom';

// Component import
import App from './App';
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";
import Create from "./components/Create/Create";
import Callback from "./components/Callback/Callback";

import "./App.css";
import Auth from './Auth/Auth';
import history from './history';

const auth = new Auth();

const handleAuthentication = (nextState, replace) => {
  if (/access_token|id_token|error/.test(nextState.location.hash)) {
    auth.handleAuthentication();
  }
}

export const makeMainRoutes = () => {
  return (
    <Router history={history} component={App}>
      <div className="main">
        <Header auth={auth} />
        <Route exact path="/" render={(props) => <App auth={auth} {...props} />} />
        <Route exact path="/create" render={(props) => <Create auth={auth} {...props} />} />
        <Route exact path="/callback" render={(props) => {
            handleAuthentication(props);
            return <Callback {...props} /> 
          }}/>
          <Footer />
      </div>
    </Router>
  );
}