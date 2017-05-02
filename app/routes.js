/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { HashRouter as Router } from 'react-router-dom';
import { Switch, Route } from 'react-router';
import App from './containers/App';
import Header from './components/Header.js';
import Patchboard from './components/Patchboard.js';
import PatchEdit from './components/PatchEdit.js';

import HomePage from './containers/HomePage';

export default () => (
  <Router>
    <App>
      <div className="app-wrapper">
        <Header />
        <Route path="/" component={Patchboard} />
        <Route path="/patch-edit" component={PatchEdit} />
      </div>
    </App>
  </Router>
);
