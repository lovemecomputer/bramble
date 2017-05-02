// @flow
import React, { Component } from 'react';

export default class Header extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="app-top-area">
        <header className="app-header">
          <h1 className="app-title">bramble</h1>
        </header>
        <div className="header-controls">
          <button type="button">+ new patch</button>
        </div>
      </div>
    );
  }
}
