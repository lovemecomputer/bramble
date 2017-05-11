// @flow
// import React, { Component } from 'react';
import React from 'react';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import { connect } from 'react-redux';
import stateReturn from '../store/state-return.js';
import marked from 'marked';
import utils from '../utils.js';
// import updatePatchBody from '../actions/update-patch-body.js';
// import { Route, Link, NavLink } from 'react-router-dom';
// import container from '../../containers/all.js';

const changeURL = (history, destination) => {
  return () => {
    if (window.location.hash !== '#/') {
      return history.push(destination);
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
    this.handleDeletePatch = this.handleDeletePatch.bind(this);
    this.toggleFormattedPreview = this.toggleFormattedPreview.bind(this);

    this.renderPatchEditor = this.renderPatchEditor.bind(this);
    this.renderFormattedPreview = this.renderFormattedPreview.bind(this);

    this.state = {
      closing: false
    };
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'SHOWING_PATCH_EDIT',
      onEscape: this.closePatchEditor,
      onCmdEnter: this.closePatchEditor,
      onCtrlShiftM: this.toggleFormattedPreview
    });
    this.auto_grow(this.refs.patchInput);
  }

  componentDidUpdate(nextProps) {
    this.auto_grow(this.refs.patchInput);
    // if (nextProps.match.url !== this.props.match.url) {
    //   console.log('auto growing!!');
    //   this.auto_grow(this.refs.patchInput);
    // }
  }

  closePatchEditor() {
    if (this.props.match.url !== '/') {
      this.setState({ closing: true });
      this.props.dispatch(changeURL(this.props.history, 'closing-edit'));
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

  handleDeletePatch(patchId) {
    this.props.dispatch({ type: 'DELETE_PATCH', patchId: patchId });
    this.closePatchEditor();
  }

  toggleFormattedPreview() {
    this.props.dispatch({
      type: 'TOGGLE_FORMATTED_PREVIEW'
    });
  }

  createMarkup(patch) {
    if (patch === undefined) {
      return { __html: '' };
    }
    let renderedHTML = marked(patch.content.body);

    let htmlWithLinks = renderedHTML.replace(
      /@([^:]+):(\d)/g,
      "<a href='#/patch-edit/$2'>$1</a>"
    );
    return { __html: htmlWithLinks };
  }

  auto_grow(element) {
    if (element) {
      element.style.height = '1.6rem';
      element.style.height = Number(element.scrollHeight + 6) + 'px';
    }
  }

  // renderDeleteButton () {
  //   return (
  //     <button onClick={this.props.deletePatch}>
  //       Delete patch
  //     </button>
  //   );
  // }

  renderPatchEditor(currentPatch) {
    if (currentPatch !== undefined) {
      return (
        <div className="modal-wrapper" key={currentPatch.patchId}>
          <div className="modal patch-editor">
            {/*<h2 className="patch-editor-heading">{currentPatch.name}</h2>*/}
            <input
              onChange={this.enterNameText}
              type="text"
              name="patch name"
              value={currentPatch.content.name}
              placeholder="patch name…"
            />
            <hr />
            <div className="patch-editor-controls">
              <a onClick={this.toggleFormattedPreview}>Formatted preview</a>
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
                  value={currentPatch.content.body}
                  ref="patchInput"
                  placeholder="plain text or markdown…"
                />
              </section>
              {this.renderFormattedPreview(currentPatch)}
            </div>
            <footer>
              <p>
                <span className="patch-id">
                  patch id: {currentPatch.patchId}
                </span>
              </p>
              <p>
                <a
                  onClick={() => {
                    this.handleDeletePatch(currentPatch.patchId);
                  }}
                >
                  Delete patch
                </a>
              </p>
            </footer>
          </div>
        </div>
      );
    }
  }

  renderFormattedPreview(currentPatch) {
    if (this.props.bramble.displayFormattedPreview) {
      return (
        <section className="formatted-preview-section">
          <article
            className="formatted-article"
            dangerouslySetInnerHTML={this.createMarkup(currentPatch)}
          />
        </section>
      );
    }
  }

  overlayShadeClassNames() {
    let classNames = 'overlay-shade';
    if (this.state.closing) classNames += ' closing';
    return classNames;
  }

  render() {
    let lookup = utils.indexesToIds(this.props.bramble.patches);
    let currentPatchId = this.props.match.params.patchId;
    let currentPatch = lookup[currentPatchId];

    var marked = require('marked');
    return (
      <div className="overlay-wrapper">
        <CSSTransitionGroup
          transitionName="modal-animation"
          transitionAppear={true}
          transitionAppearTimeout={300}
          transitionEnterTimeout={300}
          transitionLeaveTimeout={400}
        >
          <div
            className={this.overlayShadeClassNames()}
            key="overlayShade"
            onClick={() => {
              this.closePatchEditor();
            }}
          />
          {this.renderPatchEditor(currentPatch)}
        </CSSTransitionGroup>
      </div>
    );
  }
}

export default connect(stateReturn.allState)(PatchEdit);
