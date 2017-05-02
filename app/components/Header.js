// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import newPatch from '../actions/new-patch.js';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.clickNewPatch = this.clickNewPatch.bind(this);
  }

  clickNewPatch() {
    console.log('gonna make a new patch!');
    this.props.dispatch(newPatch());
  }

  render() {
    return (
      <div className="app-top-area">
        <header className="app-header">
          <h1 className="app-title">bramble</h1>
        </header>
        <div className="header-controls">
          <button type="button" onClick={this.clickNewPatch}>
            + new patch
          </button>
        </div>
      </div>
    );
  }
}

export default connect()(Header);
