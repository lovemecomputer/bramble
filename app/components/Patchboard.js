// @flow
// import React, { Component } from 'react';
import React from 'react';
import { connect } from 'react-redux';
import Patch from './patch.js';
// import { Route, Link, NavLink } from 'react-router-dom';
// import container from '../../containers/all.js';

class Patchboard extends React.Component {
  render() {
    return (
      <div>
        <h1>patchboard</h1>
        <Patch
          name="manual test"
          id="manualID"
          body="manually typed body text"
        />
      </div>
    );
  }
}

export default Patchboard;
