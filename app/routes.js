/* eslint flowtype-errors/show-errors: 0 */

// import react stuff
import React from 'react';
import { HashRouter as Router } from 'react-router-dom';
import { Switch, Route } from 'react-router';

// import components
import App from './containers/App';
import Header from './components/Header.js';
import Patchboard from './components/Patchboard.js';
import PatchEdit from './components/PatchEdit.js';
import ClosingModal from './components/ClosingModal.js';
import Preview from './components/Preview.js';


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
        <Route path="/patchboard" component={Patchboard} />
        <Route path="/patchboard/patch-edit/:patchId" component={PatchEdit} />
        <Route
          path="/patchboard/patch-edit/closing-edit"
          component={ClosingModal}
        />
        <Route exact path="/preview" component={Preview} />
        <Route exact path="/preview/:patchId" component={Preview} />
      </div>
    </App>
  </Router>
);
