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

class PatchEdit extends React.Component {
  constructor(props) {
    super(props);
    this.closePatchEditor = this.closePatchEditor.bind(this);
    this.enterBodyText = this.enterBodyText.bind(this);
    this.enterNameText = this.enterNameText.bind(this);
    this.auto_grow = this.auto_grow.bind(this);
    this.createMarkup = this.createMarkup.bind(this);
    this.toggleMarkdownPreview = this.toggleMarkdownPreview.bind(this);

    this.renderMarkdownPreview = this.renderMarkdownPreview.bind(this);
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'SHOWING_PATCH',
      onEscape: this.closePatchEditor
    });
    this.auto_grow(this.refs.patchInput);
  }

  closePatchEditor() {
    if (this.props.match.url !== '/') {
      this.props.dispatch(changeURL(this.props.history));
    }
  }

  enterNameText(event) {
    this.props.dispatch({
      type: 'UPDATE_PATCH_NAME',
      patchId: Number(this.props.match.params.patchId),
      name: event.target.value
    });
    // this.props.dispatch(updatePatchBody(e));
  }

  enterBodyText(event) {
    this.auto_grow(event.target);
    this.props.dispatch({
      type: 'UPDATE_PATCH_BODY',
      patchId: Number(this.props.match.params.patchId),
      body: event.target.value
    });
    // this.props.dispatch(updatePatchBody(e));
  }

  toggleMarkdownPreview() {
    this.props.dispatch({
      type: 'TOGGLE_MARKDOWN_PREVIEW'
    });
  }

  createMarkup(rawText) {
    return { __html: marked(rawText) };
  }

  auto_grow(element) {
    element.style.height = '5px';
    element.style.height = element.scrollHeight + 'px';
  }

  renderMarkdownPreview(currentPatch) {
    if (this.props.bramble.displayMarkdownPreview) {
      return (
        <section className="markdown-preview-section">
          <article
            className="markdown-article"
            dangerouslySetInnerHTML={this.createMarkup(currentPatch.body)}
          />
        </section>
      );
    }
  }

  render() {
    let lookup = utils.indexesToIds(this.props.bramble.patches);
    let currentPatchId = this.props.match.params.patchId;
    let currentPatch = lookup[currentPatchId];

    var marked = require('marked');
    return (
      <div className="overlay-wrapper">
        <div className="overlay-shade" onClick={this.closePatchEditor} />
        <div className="patch-editor-wrapper">
          <div className="patch-editor">
            {/*<h2 className="patch-editor-heading">{currentPatch.name}</h2>*/}
            <input
              onChange={this.enterNameText}
              type="text"
              name="patch name"
              value={currentPatch.name}
              placeholder="patch name…"
            />
            <hr />
            <div className="patch-editor-controls">
              <a onClick={this.toggleMarkdownPreview}>Markdown Preview</a>
            </div>
            <div className="patch-input-and-preview-container">
              <section className="patch-entry">
                <textarea
                  onChange={this.enterBodyText}
                  autoFocus
                  className="patch-input"
                  id="patch-raw-text"
                  name="patch raw text in markdown"
                  rows="12"
                  cols="60"
                  value={currentPatch.body}
                  ref="patchInput"
                  placeholder="plain text or markdown…"
                />
                <p>
                  <span className="patch-id">
                    patch id: {currentPatch.patchId}
                  </span>
                </p>
              </section>
              {this.renderMarkdownPreview(currentPatch)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(stateReturn.allState)(PatchEdit);
