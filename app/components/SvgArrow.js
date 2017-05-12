// @flow
import React from 'react';
import utils from '../utils.js';
import { connect } from 'react-redux';
import stateReturn from '../store/state-return.js';
// import { Route } from 'react-router-dom';

// click and drag derived from https://stackoverflow.com/questions/20926551/recommended-way-of-making-react-component-div-draggable

class SvgArrow extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    // var targetPosition = this.props.bramble.patches;
    console.log('\n RENDERING SVG');
    console.log('all patches: ', this.props.bramble.patches);
    console.log('link to: ', this.props.link[2]);

    let targetPatchIndex = utils.indexOfObjectWithPropertyValue(
      'patchId',
      Number(this.props.link[2]),
      this.props.bramble.patches
    );
    console.log('this position: ', this.props.thisPosition);

    console.log('target: ', this.props.bramble.patches[targetPatchIndex]);

    let targetPosition = {
      x: this.props.bramble.patches[targetPatchIndex].editor.position.x,
      y: this.props.bramble.patches[targetPatchIndex].editor.position.y
    };

    console.log('target position: ', targetPosition);

    let arrowOffset = {
      x: targetPosition.x - this.props.thisPosition.x,
      y: targetPosition.y - this.props.thisPosition.y
    };

    console.log('arrow offset: ', arrowOffset);

    console.log('----- done with initial logic\n ');

    return (
      <svg className="svg-arrow" width="600px" height="600px">
        <defs>
          <marker
            id="arrow"
            markerWidth="6"
            markerHeight="6"
            refX="0"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L0,6 L6,3 z" fill="rgba(128,117,138,.52)" />
          </marker>
        </defs>

        <line
          x1="0"
          y1="0"
          x2={arrowOffset.x}
          y2={arrowOffset.y}
          stroke="rgba(128,117,138,.52)"
          strokeWidth="3"
          markerEnd="url(#arrow)"
        />
      </svg>
    );
  }
}

export default connect(stateReturn.allState)(SvgArrow);
