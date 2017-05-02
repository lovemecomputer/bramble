// @flow
// import React, { Component } from 'react';
import React from 'react';
import { connect } from 'react-redux';
import stateReturn from '../store/state-return.js';
import PatchPreview from './PatchPreview.js';
// import { Route, Link, NavLink } from 'react-router-dom';
// import container from '../../containers/all.js';

class Patchboard extends React.Component {
  render() {
    return (
      <section className="patchboard">
        <PatchPreview
          name="patch test"
          id="manualID"
          body="manually typed body text"
        />
        {this.props.bramble.patches.map((patch, index) => {
          return (
            <PatchPreview
              key={patch.id}
              name={patch.name}
              id={patch.id}
              body={patch.body}
            />
          );
        })}
      </section>
    );
  }
}

export default connect(stateReturn.allState)(Patchboard);
