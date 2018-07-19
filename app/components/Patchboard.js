// @flow
import React from 'react';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import { connect } from 'react-redux';
import stateReturn from '../store/state-return.js';
import PatchNodeView from './PatchNodeView.js';
import newPatch from '../actions/newPatch.js';
import utils from '../utils.js';

class Patchboard extends React.Component {
  constructor(props) {
    super(props);
    this.openPatchEdit = this.openPatchEdit.bind(this);
    this.handleNewPatch = this.handleNewPatch.bind(this);
    this.handleInitiatePreview = this.handleInitiatePreview.bind(this);
    this.handBringPatchNodeToFront = this.handBringPatchNodeToFront.bind(this);
    this.handleSetStartingPatch = this.handleSetStartingPatch.bind(this);
    this.dispatchPositionUpdate = this.dispatchPositionUpdate.bind(this);
    this.dispatchMenuOpen = this.dispatchMenuOpen.bind(this);
    this.dispatchMenuClose = this.dispatchMenuClose.bind(this);
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'SHOWING_PATCHBOARD',
      newPatchShortcut: this.handleNewPatch,
      initiatePreview: this.handleInitiatePreview
    });
  }

  handleNewPatch() {
    this.props.dispatch(newPatch());
    if (this.props.history.location.pathname.includes('patch-edit')) {
      this.props.history.push(
        `/patchboard/patch-edit/${this.props.bramble.patches[this.props.bramble.patches.length - 1].patchId}`
      );
    }
  }

  handleInitiatePreview() {
    var targetIndex = utils.indexOfObjectWithPropertyValue(
      'isStartingPatch',
      true,
      this.props.bramble.patches
    );
    console.log('▶️ preview starting target: ', targetIndex);
    if (targetIndex === null || targetIndex === undefined) {
      window.alert(
        'No starting patch found. Set a patch to be a starting point.'
      );
    } else {
      this.props.history.push('\n/preview/' + targetIndex);
    }
  }

  handleDeletePatch(patchId) {
    this.props.dispatch({ type: 'DELETE_PATCH', patchId: patchId });
  }

  handleSetStartingPatch(patchId) {
    this.props.dispatch({ type: 'SET_STARTING_PATCH', patchId: patchId });
  }

  handBringPatchNodeToFront(patchId) {
    this.props.dispatch({
      type: 'BRING_PATCH_NODE_TO_FRONT',
      patchId: patchId
    });
  }

  dispatchPositionUpdate(patchId, newPosition) {
    this.props.dispatch({
      type: 'UPDATE_PATCH_POSITION',
      patchId: patchId,
      x: newPosition.x,
      y: newPosition.y
    });
  }

  dispatchMenuOpen(patchId) {
    this.props.dispatch({
      type: 'OPEN_PATCH_NODE_MENU',
      patchId: patchId
    });
  }

  dispatchMenuOpen(patchId) {
    this.props.dispatch({
      type: 'OPEN_PATCH_NODE_MENU',
      patchId: patchId
    });
  }

  dispatchMenuClose() {
    this.props.dispatch({
      type: 'CLOSE_PATCH_NODE_MENU'
    });
  }

  openPatchEdit(patchId) {
    this.props.history.push(`/patchboard/patch-edit/${patchId}`);
  }

  patchboardWrapperClasses() {
    let classNames = 'patchboard-wrapper';
    if (window.location.hash.indexOf('patch-edit') >= 0) {
      // TODO: how to prevent scrolling?
      classNames += ' modal-open';
    }
    return classNames;
  }

  render() {
    return (
      <div className={this.patchboardWrapperClasses()} ref="patchboardWrapper">
        <div className="patchboard-controls">
          <button
            type="button"
            className="command"
            onClick={this.handleNewPatch}
            tabIndex="1"
          >
            + new patch
            <span className="tooltip shortcut">
              <i>⌘ cmd</i> + <i>n</i>
            </span>
          </button>
          <button
            type="button"
            className="command"
            onClick={this.handleInitiatePreview}
            tabIndex="1"
          >
            ▶︎ preview story
            <span className="tooltip shortcut">
              <i>⌘ cmd</i> + <i>p</i>
            </span>
          </button>
        </div>
        <section className="patchboard">
          <CSSTransitionGroup
            transitionName="patch-node-animation"
            transitionEnterTimeout={100}
            transitionLeaveTimeout={1500}
          >
            {this.props.bramble.patches.map((patch, index) => {
              return (
                <PatchNodeView
                  key={patch.patchId}
                  patchId={patch.patchId}
                  name={patch.content.name}
                  body={patch.content.body}
                  isStartingPatch={patch.isStartingPatch}
                  menuIsOpen={
                    this.props.bramble.menuOpenedPatch === patch.patchId
                  }
                  openMenu={() => {
                    this.dispatchMenuOpen(patch.patchId);
                  }}
                  closeMenu={this.dispatchMenuClose}
                  xPos={patch.editor.position.x}
                  yPos={patch.editor.position.y}
                  z={patch.editor.position.z}
                  updatePosition={this.dispatchPositionUpdate}
                  bringToFront={() =>
                    this.handBringPatchNodeToFront(patch.patchId)}
                  openPatchEdit={() => this.openPatchEdit(patch.patchId)}
                  deletePatch={() => this.handleDeletePatch(patch.patchId)}
                  setStartPatch={() =>
                    this.handleSetStartingPatch(patch.patchId)}
                  dragFunction={() => {
                    this.handleDragPatch(patch.patchId);
                  }}
                  patches={this.props.bramble.patches}
                />
              );
            })}
          </CSSTransitionGroup>
        </section>
      </div>
    );
  }
}

export default connect(stateReturn.allState)(Patchboard);
