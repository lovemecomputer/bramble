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
    this.autoGrow = this.autoGrow.bind(this);
    this.createMarkup = this.createMarkup.bind(this);
    this.insertLink = this.insertLink.bind(this);
    this.handleDeletePatch = this.handleDeletePatch.bind(this);
    this.toggleFormattedPreview = this.toggleFormattedPreview.bind(this);

    this.renderPatchEditor = this.renderPatchEditor.bind(this);
    this.renderFormattedPreview = this.renderFormattedPreview.bind(this);
    this.renderPatchesLinksMenu = this.renderPatchesLinksMenu.bind(this);

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
    // TODO: THIS BELOW
    // this.setState({ cursorPositionStart: currentPatch.content.body.length });
  }

  // componentDidUpdate(nextProps) {
  //   // this.autoGrow(this.refs.patchInput);
  //   // if (nextProps.match.url !== this.props.match.url) {
  //   //   this.autoGrow(this.refs.patchInput);
  //   // }=
  // }

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
    // this.autoGrow(event.target);
    this.props.dispatch({
      type: 'UPDATE_PATCH_BODY',
      patchId: Number(this.props.match.params.patchId),
      body: event.target.value
    });
    // this.props.dispatch(updatePatchBody(e));
  }

  insertLink(options) {
    console.log('\n\n\n>>> INSERTING LINK!!');
    // TODO: MUST LOOK UP BODY BY ID I GUESS
    let lookup = utils.indexesToIds(this.props.bramble.patches);
    let currentPatchId = this.props.match.params.patchId;
    let currentPatch = lookup[currentPatchId];

    // inserting into string derived from https://stackoverflow.com/questions/4364881/inserting-string-at-position-x-of-another-string
    let currentText = currentPatch.content.body;
    let linkMarkupStartCharacter = '@@';
    let linkMarkupIdentifyingCharacter = ':';
    let defaultLinkText = 'link text';
    let linkInsert = [''];
    let linkText = '';
    let linkId = '13';
    let positionStart = this.state.cursorPositionStart;
    let positionEnd = this.state.cursorPositionEnd;
    // use a string type what placement option for cursor e.g. 'inside', 'after'
    let putCursorHereAfterLinkInsertion = '';
    let afterInsertionCursorTarget = 0;

    // if end point hasn't been define, there is no selection
    if (positionEnd === undefined || positionEnd === null)
      positionEnd = positionStart;

    // BUILD LINK :::::::::
    linkInsert.push(linkMarkupStartCharacter);

    if (positionEnd === positionStart) {
      // if standard, single-place cursor position
      // if clicked the button rather than using a shortcut, put in example text
      if (options && options.clicked) {
        // if clicked button, we want to put in example text
        linkInsert.push(defaultLinkText);
        putCursorHereAfterLinkInsertion = 'after';
      } else {
        // if keyboard shortcut, want to place cursor inside and let ppl type in their own text quickly
        linkInsert.push('');
        putCursorHereAfterLinkInsertion = 'inside';
      }
    } else {
      // if we have a text selection!
      let selectedText = currentPatch.content.body.slice(
        positionStart,
        positionEnd
      );
      linkInsert.push(selectedText);
      // puts cursor to end of entire link:
      putCursorHereAfterLinkInsertion = 'after';
    }

    linkInsert.push(linkMarkupIdentifyingCharacter);
    linkInsert.push(linkId);

    let linkInsertString = linkInsert.join('');

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

    switch (putCursorHereAfterLinkInsertion) {
      case 'inside':
        // puts cursor to end of entire link:
        afterInsertionCursorTarget =
          Number(positionStart) + linkMarkupStartCharacter.length;
        break;

      case 'after':
        // puts cursor inside of link:
        afterInsertionCursorTarget =
          Number(positionStart) + linkInsertString.length;
        break;
    }

    this.refs.patchInput.selectionEnd = afterInsertionCursorTarget;
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

    // TODO: escape regex characters
    // - https://lodash.com/docs/4.17.4#escapeRegExp
    // - https://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
    //  - can add to utils.js:
    /*  function escapeRegExp(str) {
              return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
            } */

    // TODO: escape brambleScript characters

    // NOTE: use this tool to test regex: http://scriptular.com/

    let htmlWithLinks = renderedHTML.replace(
      /@@([^:]+):(\d+)/g,
      "<a href='#/patchboard/patch-edit/$2'>$1</a>"
    );
    return { __html: htmlWithLinks };
  }

  autoGrow(element) {
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

  renderPatchesLinksMenu() {
    // let lookup = utils.indexesToIds(this.props.bramble.patches);
    // let currentPatchId = this.props.match.params.patchId;
    // let currentPatch = lookup[currentPatchId];
    if (true) {
      return (
        <div className="patch-links-menu-overlay">
          <div className="patch-links-menu">
            <h4>Select target patch:</h4>
            <ul>
              {this.props.bramble.patches.map((patch, index) => {
                return (
                  <li>
                    <a className="patch-links-menu-choice">
                      <div className="patch-name">{patch.content.name}</div>
                      <div className="patch-body">{patch.content.body}</div>
                      <div className="patch-id">{patch.patchId}</div>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      );
    }
  }

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
              <a onClick={this.toggleFormattedPreview} className="command">
                ❏ Formatted preview
                <span className="tooltip shortcut">
                  <i>⌃ ctrl</i> + <i>⇧ shift</i> + <i>m</i>
                </span>
              </a>
            </div>
            <div className="patch-input-and-preview-container">
              <section className="patch-entry">
                <div className="pach-input-controls">
                  <a
                    onClick={() => this.insertLink({ clicked: true })}
                    className="command"
                  >
                    🔗 Link to passage
                    <span className="tooltip shortcut">
                      <i>⌘ cmd</i> + <i>l</i>
                    </span>
                  </a>
                </div>
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
                  onMouseUp={event => {
                    this.storeCursorpositionInState(
                      event.target.selectionStart,
                      event.target.selectionEnd
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
                  🗑 Delete patch
                </a>
              </p>
            </footer>
          </div>
          {this.renderPatchesLinksMenu()}
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
    // do this ansychronously so all the text can load before resizing
    setTimeout(() => {
      this.autoGrow(this.refs.patchInput);
    }, 0);
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
