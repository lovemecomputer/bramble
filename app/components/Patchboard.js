// @flow
// import React, { Component } from 'react';
import React from 'react';
import { connect } from 'react-redux';
import stateReturn from '../store/state-return.js';
import PatchPreview from './PatchPreview.js';
// import { Route, Link, NavLink } from 'react-router-dom';
// import container from '../../containers/all.js';

class Patchboard extends React.Component {
  constructor(props) {
    super(props);
    this.openPatchEdit = this.openPatchEdit.bind(this);
  }
  openPatchEdit(patchId) {
    console.log(`double clicked ${patchId}`);
    this.props.history.push(`/patch-edit/${patchId}`);
  }

  render() {
    console.log('\n rendering Patchboard');
    console.log('>>> location:', this.props.history.location.pathname);
    return (
      <section className="patchboard">
        {this.props.bramble.patches.map((patch, index) => {
          return (
            <PatchPreview
              key={patch.patchId}
              name={patch.name}
              patchId={patch.patchId}
              body={patch.body}
              openPatchEdit={() => this.openPatchEdit(patch.patchId)}
            />
          );
        })}
      </section>
    );
  }
}

export default connect(stateReturn.allState)(Patchboard);
