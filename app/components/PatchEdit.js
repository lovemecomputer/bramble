// @flow
// import React, { Component } from 'react';
import React from 'react';
import { connect } from 'react-redux';
import stateReturn from '../store/state-return.js';
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

class PatchEdit extends React.Component {
  constructor(props) {
    super(props);
    this.closePatchEditor = this.closePatchEditor.bind(this);
    this.enterText = this.enterText.bind(this);
    this.auto_grow = this.auto_grow.bind(this);
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'SHOWING_PATCH',
      onEscape: this.closePatchEditor
    });
  }

  closePatchEditor() {
    if (this.props.match.url !== '/') {
      this.props.dispatch(changeURL(this.props.history));
    }
  }

  enterText(event) {
    this.auto_grow(event.target);
    this.props.dispatch({
      type: 'UPDATE_PATCH',
      patchId: Number(this.props.match.params.patchId),
      body: event.target.value
    });
    // this.props.dispatch(updatePatchBody(e));
  }

  auto_grow(element) {
    element.style.height = '5px';
    element.style.height = element.scrollHeight + 'px';
  }

  render() {
    let lookup = utils.indexesToIds(this.props.bramble.patches);
    let currentPatchId = this.props.match.params.patchId;
    let currentPatch = lookup[currentPatchId];

    return (
      <div className="overlay-wrapper">
        <div className="overlay-shade" onClick={this.closePatchEditor} />
        <div className="patch-editor-wrapper">
          <div className="patch-editor">
            <h2 className="patch-editor-heading">{currentPatch.name}</h2>
            <div className="editor-container">
              <section className="patch-entry">
                <textarea
                  onChange={this.enterText}
                  className="patch-input"
                  id="patch-raw-text"
                  name="patch raw text in markdown"
                  rows="12"
                  cols="60"
                  value={currentPatch.body}
                  ref="patchInput"
                  placeholder="type in markdown…"
                />
                <p>patch id: {currentPatch.patchId}</p>
              </section>
              {/*<section className="markdown-preview-section">
                <article
                  className="markdown-article"
                  dangerouslySetInnerHTML={this.createMarkup(currentPatch.body)}
                />
              </section>*/}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(stateReturn.allState)(PatchEdit);
