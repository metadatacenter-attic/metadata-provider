import React from 'react';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from "./components/NavBar";
import {useAuth0} from "./react-auth0-spa";
import {Route, Router, Switch} from "react-router-dom";
import Profile from "./components/Profile";
import history from "./utils/history";
import PrivateRoute from "./components/PrivateRoute";
import Main from "./components/Main";

//import 'holderjs/holder.js'; // uninstall if not needed

export default function App() {



  const {loading} = useAuth0();

  if (loading) {
    return <div>Loading...</div>;
  }


  return (
    <div className="App">

      <Router history={history}>

        <Switch>
          {/*<PrivateRoute path="/" component={Main} />*/}
          {/*<PrivateRoute path="/profile" component={Profile} />*/}
          {/*<PrivateRoute path="/main" component={Main} />*/}
          <Route path="/" render={Main} />
          <Route path="/profile" component={Profile} />
          <Route path="/main" component={Main} />
        </Switch>

      </Router>
    </div>
  );
}
