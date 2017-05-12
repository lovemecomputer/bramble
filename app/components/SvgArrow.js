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

    let nodeWidth = 180;

    let thisPosition = Object.assign({}, this.props.thisPosition);
    // thisPosition.x -= nodeWidth;

    let targetPosition = {
      x: this.props.bramble.patches[targetPatchIndex].editor.position.x -
        nodeWidth,
      y: this.props.bramble.patches[targetPatchIndex].editor.position.y
    };

    console.log('target position: ', targetPosition);

    let arrowOffset = {
      x: thisPosition.x - targetPosition.x,
      y: thisPosition.y - targetPosition.y
    };

    console.log('arrow offset: ', arrowOffset);

    let arrowMagnitude = Math.sqrt(
      arrowOffset.x * arrowOffset.x + arrowOffset.y * arrowOffset.y
    );

    console.log('magnitude: ', arrowMagnitude);

    let facingAngle = Math.atan2(
      targetPosition.y - thisPosition.y,
      targetPosition.x - thisPosition.x
    );

    console.log('facing angle: ', facingAngle);

    console.log('----- done with initial logic\n ');

    var rotation = () => {
      return {
        transform: `rotatez(${facingAngle}rad)`,
        'transform-origin': 'left center'
      };
    };

    return (
      <div className="arrow-container">
        <svg
          className="svg-arrow"
          width={arrowMagnitude}
          height="12px"
          style={rotation()}
        >
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
            y1="6"
            x2={arrowMagnitude - 20}
            y2="6"
            stroke="rgba(128,117,138,.52)"
            strokeWidth="3"
            markerEnd="url(#arrow)"
          />
        </svg>
      </div>
    );
  }
}

export default connect(stateReturn.allState)(SvgArrow);
