// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';

class Header extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="app-top-area">
        <header className="app-header">
          <h1 className="app-title">bramble</h1>
        </header>
      </div>
    );
  }
}

export default connect()(Header);
