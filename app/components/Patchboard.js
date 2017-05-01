// @flow
// import React, { Component } from 'react';
import React from 'react';
import { connect } from 'react-redux';
// import { Route, Link, NavLink } from 'react-router-dom';
// import container from '../../containers/all.js';

class Patchboard extends React.Component {
  render() {
    return (
      <div>
        <div className={styles.container} data-tid="container" />
      </div>
    );
  }
}

export default Patchboard;
