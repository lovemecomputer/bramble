/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { HashRouter as Router } from 'react-router-dom';
import { Switch, Route } from 'react-router';
import App from './containers/App';
import Header from './components/Header.js';
import Patchboard from './components/Patchboard.js';
import PatchEdit from './components/PatchEdit.js';
import ClosingModal from './components/ClosingModal.js';
import Preview from './components/Preview.js';

import HomePage from './containers/HomePage';

function wrapperClassNames() {
  let classNames = ['app-wrapper'];
  if (window.location.hash.includes('patch-edit'))
    classNames.push('modal-visible');
  return classNames.join(' ');
}

export default () => (
  <Router>
    <App>
      <div className={wrapperClassNames()}>
        <Header />
        <Route path="/" component={Patchboard} />
        <Route path="/patch-edit/:patchId" component={PatchEdit} />
        <Route path="/patch-edit/closing-edit" component={ClosingModal} />
        <Route exact path="/preview" component={Preview} />
        <Route exact path="/preview/:id" component={Preview} />
      </div>
    </App>
  </Router>
);
