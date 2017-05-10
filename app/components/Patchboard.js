// @flow
import React from 'react';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import { connect } from 'react-redux';
import stateReturn from '../store/state-return.js';
import PatchNodeView from './PatchNodeView.js';
import newPatch from '../actions/new-patch.js';

class Patchboard extends React.Component {
  constructor(props) {
    super(props);
    this.openPatchEdit = this.openPatchEdit.bind(this);
    this.handleNewPatch = this.handleNewPatch.bind(this);
    this.handleInitiatePreview = this.handleInitiatePreview.bind(this);
    this.dispatchPositionUpdate = this.dispatchPositionUpdate.bind(this);
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
        `/patch-edit/${this.props.bramble.patches[this.props.bramble.patches.length - 1].patchId}`
      );
    }
  }

  handleInitiatePreview() {
    this.props.history.push('/preview/0');
  }

  handleDeletePatch(patchId) {
    this.props.dispatch({ type: 'DELETE_PATCH', patchId: patchId });
  }

  dispatchPositionUpdate(patchId, newPosition) {
    this.props.dispatch({
      type: 'UPDATE_PATCH_POSITION',
      patchId: patchId,
      x: newPosition.x,
      y: newPosition.y
    });
  }

  openPatchEdit(patchId) {
    this.props.history.push(`/patch-edit/${patchId}`);
  }

  render() {
    return (
      <div className="patchboard-wrapper">
        <div className="header-controls">
          <button type="button" onClick={this.handleNewPatch} tabIndex="1">
            + new patch
          </button>
          <button
            type="button"
            onClick={this.handleInitiatePreview}
            tabIndex="1"
          >
            preview story
          </button>
        </div>
        <section className="patchboard">
          <CSSTransitionGroup
            transitionName="patch-node-animation"
            transitionEnterTimeout={300}
            transitionLeaveTimeout={1500}
          >
            {this.props.bramble.patches.map((patch, index) => {
              return (
                <PatchNodeView
                  key={patch.patchId}
                  patchId={patch.patchId}
                  name={patch.content.name}
                  body={patch.content.body}
                  openPatchEdit={() => this.openPatchEdit(patch.patchId)}
                  deletePatch={() => this.handleDeletePatch(patch.patchId)}
                  dragFunction={() => {
                    this.handleDragPatch(patch.patchId);
                  }}
                  xPos={patch.editor.position.x}
                  yPos={patch.editor.position.y}
                  updatePosition={this.dispatchPositionUpdate}
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
