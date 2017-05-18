// @flow
// import React, { Component } from 'react';
import React from 'react';
import { connect } from 'react-redux';
import stateReturn from '../store/state-return.js';
import marked from 'marked';
import utils from '../utils.js';
// import updatePatchBody from '../actions/update-patch-body.js';
// import { Route, Link, NavLink } from 'react-router-dom';
// import container from '../../containers/all.js';

const changeURL = history => {
  return () => {
    if (window.location.hash !== '#/') {
      return history.push('/');
    }
  };
};

class Preview extends React.Component {
  constructor(props) {
    super(props);
    this.closePreview = this.closePreview.bind(this);
  }
  componentWillUpdate(nextProps) {
    console.log('old props', this.props);
    console.log('new props', nextProps);
    let currPatchID = this.props.match.params.id;
    let newPatchID = nextProps.match.params.id;

    if (currPatchID !== newPatchID && newPatchID !== undefined) {
      this.setState({
        currentPatch: this.props.bramble.patches[newPatchID]
      });
    }
  }

  closePreview() {
    if (this.props.match.url !== '/') {
      this.props.dispatch(changeURL(this.props.history));
    }
  }

  createMarkup(patch) {
    if (patch === undefined) {
      return { __html: '' };
    }
    let renderedHTML = marked(patch.content.body);

    let htmlWithLinks = renderedHTML.replace(
      /@@([^:]+):(\d+)/g,
      "<a href='#/preview/$2'>$1</a>"
    );
    return { __html: htmlWithLinks };
  }

  overlayShadeClassNames() {
    let classNames = 'modal-and-overlay-wrapper overlay-wrapper';
    // if (this.state.closing) classNames += ' closing';
    return classNames;
  }

  render() {
    var currentPatchIndex = utils.indexOfObjectWithPropertyValue(
      'patchId',
      Number(this.props.match.params.patchId),
      this.props.bramble.patches
    );
    let currentPatch = this.props.bramble.patches[currentPatchIndex];

    var marked = require('marked');
    return (
      <div className={this.overlayShadeClassNames()} key="overlayWrapper">
        <div className="overlay-click-to-close" onClick={this.closePreview} />
        <div className="modal-wrapper story-preview-wrapper">
          <div className="modal">
            <div className="story-preview-wrapper">
              <div
                className="patch-body"
                dangerouslySetInnerHTML={this.createMarkup(currentPatch)}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(stateReturn.allState)(Preview);
