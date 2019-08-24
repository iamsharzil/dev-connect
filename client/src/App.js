import React, { Fragment } from 'react';
import { Switch, Route } from 'react-router-dom';

import './App.css';

import Navbar from './components/navbar/navbar.component';
import Alert from './components/alert/alert.component';

import Landing from './pages/Landing/landing.component';
import Register from './pages/Register/register.component';
import Login from './pages/Login/login.component';

const App = () => (
  <Fragment>
    <Navbar />

    <Route exact path="/" component={Landing} />

    <section className="container">
      <Alert />
      <Switch>
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
      </Switch>
    </section>
  </Fragment>
);

export default App;
