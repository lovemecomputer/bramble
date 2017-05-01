/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { HashRouter as Router } from 'react-router-dom';
import { Switch, Route } from 'react-router';
import App from './containers/App';
import Header from './components/Header.js';

import HomePage from './containers/HomePage';
import CounterPage from './containers/CounterPage';

export default () => (
  <Router>
    <App>
      <Header />
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/counter" component={CounterPage} />
      </Switch>
    </App>
  </Router>
);
