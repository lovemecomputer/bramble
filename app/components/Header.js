// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.saveProject = this.saveProject.bind(this);
    this.openProject = this.openProject.bind(this);
  }

  saveProject() {
    console.log('clicked save!');
    this.props.dispatch({ type: 'FILE_SAVE' });
  }

  openProject() {
    console.log('clicked open!');
    this.props.dispatch({ type: 'FILE_OPEN' });
  }

  render() {
    return (
      <div className="app-top-area">
        <header className="app-header">
          <h1 id="app-title" className="app-title">bramble</h1>
          <div className="main-header-controls">
            <a onClick={this.saveProject}>save</a>
            <a onClick={this.openProject}>open</a>
          </div>
        </header>
      </div>
    );
  }
}

export default connect()(Header);
