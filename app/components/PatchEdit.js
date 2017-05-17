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
    this.insertLink = this.insertLink.bind(this);
    this.handleDeletePatch = this.handleDeletePatch.bind(this);
    this.toggleFormattedPreview = this.toggleFormattedPreview.bind(this);

    this.renderPatchEditor = this.renderPatchEditor.bind(this);
    this.renderFormattedPreview = this.renderFormattedPreview.bind(this);

    this.state = {
      currentPatch: {},
      currentPatchId: undefined,
      closing: false,
      cursorPositionStart: 0,
      cursorPositionEnd: 0
    };
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'SHOWING_PATCH_EDIT',
      onEscape: this.closePatchEditor,
      onCmdEnter: this.closePatchEditor,
      onCtrlShiftM: this.toggleFormattedPreview,
      onCmdL: this.insertLink
    });
    this.auto_grow(this.refs.patchInput);
    // TODO: THIS BELOW
    // this.setState({ cursorPositionStart: currentPatch.content.body.length });
  }

  componentDidUpdate(nextProps) {
    this.auto_grow(this.refs.patchInput);
    // if (nextProps.match.url !== this.props.match.url) {
    //   this.auto_grow(this.refs.patchInput);
    // }=
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
    // console.log(event.target.selectionStart);
    // this.setState({ cursorPositionStart: event.target.selectionStart });
    this.auto_grow(event.target);
    this.props.dispatch({
      type: 'UPDATE_PATCH_BODY',
      patchId: Number(this.props.match.params.patchId),
      body: event.target.value
    });
    // this.props.dispatch(updatePatchBody(e));
  }

  insertLink() {
    console.log('\n\n\n>>> INSERTING LINK!!');
    // TODO: MUST LOOK UP BODY BY ID I GUESS
    let lookup = utils.indexesToIds(this.props.bramble.patches);
    let currentPatchId = this.props.match.params.patchId;
    let currentPatch = lookup[currentPatchId];

    // inserting into string derived from https://stackoverflow.com/questions/4364881/inserting-string-at-position-x-of-another-string
    let currentText = currentPatch.content.body;
    let linkMarkupStartCharacter = '@';
    let linkMarkupIdentifyingCharacter = ':';
    let defaultLinkText = 'link text';
    let linkInsert = [''];
    let linkText = '';
    let linkId = '13';
    let positionStart = this.state.cursorPositionStart;
    let positionEnd = this.state.cursorPositionEnd;

    // if end point hasn't been define, there is no selection
    if (positionEnd === undefined || positionEnd === null)
      positionEnd = positionStart;

    // build link
    linkInsert.push(linkMarkupStartCharacter);

    if (positionEnd === positionStart) {
      // if cursor normal single-place cursor position
      linkInsert.push(defaultLinkText);
    } else {
      let selectedText = currentPatch.content.body.slice(
        positionStart,
        positionEnd
      );
      console.log('|| selectedText: ', selectedText);
      linkInsert.push(selectedText);
    }
    linkInsert.push(linkMarkupIdentifyingCharacter);
    linkInsert.push(linkId);

    let linkInsertString = linkInsert.join('');

    console.log('link insert:', linkInsertString);

    let output = [
      currentText.slice(0, positionStart),
      linkInsertString,
      currentText.slice(positionEnd)
    ].join('');
    this.props.dispatch({
      type: 'UPDATE_PATCH_BODY',
      patchId: Number(currentPatchId),
      body: output
    });
    this.refs.patchInput.selectionEnd =
      Number(positionStart) + linkInsertString.length;
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
      "<a href='#/patchboard/patch-edit/$2'>$1</a>"
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

  storeCursorpositionInState(positionStart, positionEnd) {
    this.setState({
      cursorPositionStart: positionStart,
      cursorPositionEnd: positionEnd
    });
  }
  // TODO: set curosr position after pasting
  // setCursorposition;
  // onInput={event => {
  //   this.storeCursorpositionInState(event.target.selectionStart, event.target.selectionEnd);
  // }}
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
            <a className="close-modal-button" onClick={this.closePatchEditor}>
              x
            </a>
            <hr />
            <div className="patch-editor-controls">
              <a onClick={this.toggleFormattedPreview}>Formatted preview</a>
            </div>
            <div className="patch-input-and-preview-container">
              <section className="patch-entry">
                <textarea
                  onChange={event => {
                    this.enterBodyText(event);
                    this.storeCursorpositionInState(
                      event.target.selectionStart,
                      event.target.selectionEnd
                    );
                  }}
                  onKeyUp={event => {
                    this.storeCursorpositionInState(
                      event.target.selectionStart,
                      event.target.selectionEnd
                    );
                  }}
                  onFocus={event => {
                    this.storeCursorpositionInState(
                      event.target.selectionStart,
                      event.target.selectionEnd
                    );
                  }}
                  onBlur={event => {
                    this.storeCursorpositionInState(
                      event.target.selectionStart,
                      event.target.selectionEnd
                    );
                  }}
                  onMouseUp={event => {
                    this.storeCursorpositionInState(
                      event.target.selectionStart
                    );
                  }}
                  onClick={event => {
                    this.storeCursorpositionInState(
                      event.target.selectionStart
                    );
                  }}
                  onDoubleClick={event => {
                    this.storeCursorpositionInState(
                      event.target.selectionStart
                    );
                  }}
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
    let classNames = 'overlay-wrapper';
    if (this.state.closing) classNames += ' closing';
    return classNames;
  }

  render() {
    let lookup = utils.indexesToIds(this.props.bramble.patches);
    let currentPatchId = this.props.match.params.patchId;
    let currentPatch = lookup[currentPatchId];

    var marked = require('marked');
    return (
      <div className="modal-and-overlay-wrapper">
        <div className={this.overlayShadeClassNames()} key="overlayWrapper">
          <CSSTransitionGroup
            transitionName="modal-animation"
            transitionAppear={true}
            transitionAppearTimeout={175}
            transitionEnterTimeout={300}
            transitionLeaveTimeout={400}
          >

            <div
              className="overlay-click-to-close"
              onClick={this.closePatchEditor}
            />
            {this.renderPatchEditor(currentPatch)}

          </CSSTransitionGroup>
        </div>
      </div>
    );
  }
}

export default connect(stateReturn.allState)(PatchEdit);
