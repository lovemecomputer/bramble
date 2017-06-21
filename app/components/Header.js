// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import stateReturn from '../store/state-return.js';

import fileOpen from '../actions/fileOpen.js';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.saveProject = this.saveProject.bind(this);
    this.openProject = this.openProject.bind(this);
    this.newProject = this.newProject.bind(this);
  }

  saveProject() {
    console.log('clicked save!');
    this.props.dispatch({ type: 'FILE_SAVE' });
  }

  openProject() {
    console.log('clicked open!');
    // this.props.dispatch({ type: 'FILE_OPEN' });
    this.props.dispatch(fileOpen());
  }

  newProject() {
    console.log('clicked open!');
    // this.props.dispatch({ type: 'FILE_OPEN' });
    this.props.dispatch({ type: 'NEW_PROJECT' });
  }

  render() {
    return (
      <div className="app-top-area">
        <header className="app-header">
          {/*<h1 id="app-title" className="app-title">bramble</h1>
          <span className="project-name">
            📄 {this.props.bramble.projectName}
          </span>*/}
          <div className="main-header-controls">
            <a onClick={this.saveProject}>save</a>
            <a onClick={this.openProject}>open</a>
            <a onClick={this.newProject}>new</a>
          </div>
        </header>
      </div>
    );
  }
}

export default connect(stateReturn.allState)(Header);
