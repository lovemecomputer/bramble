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
    this.state = {
      currentPatch: this.props.bramble.patches[this.props.match.params.id || 0]
    };
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

  componentDidMount() {
    // this.props.dispatch({
    //   type: 'SHOWING_PATCH',
    //   onEscape: this.closePatchEditor,
    //   onCmdEnter: this.closePatchEditor,
    //   onToggleMarkdownPreview: this.toggleMarkdownPreview
    // });
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
    let renderedHTML = marked(patch.body);

    let htmlWithLinks = renderedHTML.replace(
      /@([^:]+):(\d)/g,
      "<a href='#/preview/$2'>$1</a>"
    );
    return { __html: htmlWithLinks };
  }

  render() {
    var marked = require('marked');
    return (
      <div className="overlay-wrapper">
        <div className="overlay-shade" onClick={this.closePreview} />
        <div className="patch-editor-wrapper">
          <div className="patch-editor">
            <div className="story-preview-wrapper">
              <div
                className="patch-body"
                dangerouslySetInnerHTML={this.createMarkup(
                  this.state.currentPatch
                )}
              />
              {/*this.props.bramble.patches.map((patch, index) => {
                return (
                  <div
                    key={patch.patchId}
                    className="patch-body"
                    dangerouslySetInnerHTML={this.createMarkup(patch.body)}
                  />
                );
              })*/}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(stateReturn.allState)(Preview);
