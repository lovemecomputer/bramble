// @flow
// import React, { Component } from 'react';
import React from 'react';
import { connect } from 'react-redux';
import stateReturn from '../store/state-return.js';
// import { Route, Link, NavLink } from 'react-router-dom';
// import container from '../../containers/all.js';

class PatchEdit extends React.Component {
  constructor(props) {
    super(props);
    this.onClickToClose = this.onClickToClose.bind(this);
  }

  onClickToClose() {
    console.log('closing patch edit!');
    this.props.history.push('/');
  }

  render() {
    console.log('\n rendering PatchEdit');
    console.log(this.props.history.location.pathname);
    return (
      <div className="overlay-shade" onClick={this.onClickToClose}>
        <h1>Patch Edit</h1>
      </div>
    );
  }
}

export default connect(stateReturn.allState)(PatchEdit);
