// @flow
import React from 'react';
import utils from '../utils.js';
import { connect } from 'react-redux';
import stateReturn from '../store/state-return.js';
// import { Route } from 'react-router-dom';

class SvgArrow extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    // var targetPosition = this.props.bramble.patches;
    // console.log('\n RENDERING SVG');
    // console.log('all patches: ', this.props.bramble.patches);
    // console.log('link to: ', this.props.link[2]);

    let targetPatchIndex = utils.indexOfObjectWithPropertyValue(
      'patchId',
      Number(this.props.link[2]),
      this.props.bramble.patches
    );

    let nodeWidth = 160;
    let arrowColor = 'rgba(128,117,138,.52)';
    let arrowNoTargetColor = 'rgba(204,135,105,.3)';
    let targetPosition = { x: 0, y: 0 };
    let thisPosition = Object.assign({}, this.props.thisPosition);

    let targetingNodeAdjustment = 1;
    if (targetPatchIndex === null || targetPatchIndex === undefined) {
      // if no target exists!
      targetPosition.x = thisPosition.x + nodeWidth / 4 / 10;
      targetPosition.y = thisPosition.y;
      arrowColor = arrowNoTargetColor;
      targetingNodeAdjustment = -1;
    } else {
      targetPosition.x = this.props.bramble.patches[
        targetPatchIndex
      ].editor.position.x;
      targetPosition.y = this.props.bramble.patches[
        targetPatchIndex
      ].editor.position.y;
    }

    let arrowOffset = {
      x: thisPosition.x - targetPosition.x,
      y: thisPosition.y - targetPosition.y
    };

    let arrowMagnitude = Math.sqrt(
      arrowOffset.x * arrowOffset.x + arrowOffset.y * arrowOffset.y
    );

    arrowMagnitude -= nodeWidth / 1.7;

    if (arrowMagnitude < 0) arrowMagnitude *= targetingNodeAdjustment;

    let facingAngle = Math.atan2(
      targetPosition.y - thisPosition.y,
      targetPosition.x - thisPosition.x
    );

    if (targetingNodeAdjustment === 1) {
      let calculateDiagonalDistance = angle => {
        let freq = 4;
        // let amp = (nodeWidth * 1.414 - nodeWidth) / 2;
        let amp = -20;
        // let number = nodeWidth / 2 + amp * Math.sin(Math.PI * angle);
        let number = amp * Math.sin(180 + Math.PI + angle * freq);
        return number;
      };
      arrowMagnitude -= calculateDiagonalDistance(facingAngle);
    }

    arrowMagnitude = utils.clamp(arrowMagnitude, 100, Infinity);

    var rotation = () => {
      // let adjustment = calculateDiagonalDistance(facingAngle);
      // console.log(adjustment);
      // return {
      //   transform: `rotatez(${facingAngle}rad) translateX(${adjustment / 10}rem)`,
      //   transformOrigin: 'left center'
      // };
      return {
        // transform: `rotatez(${facingAngle}rad) translateX(${nodeWidth / 2.5 / 10}rem)`,
        transform: `rotatez(${facingAngle}rad)`,
        transformOrigin: 'left 3px'
      };
      // return {
      //   transform: `rotatez(${facingAngle}rad)`,
      //   transformOrigin: 'left center'
      // };
    };

    return (
      <svg
        className="svg-arrow"
        width={arrowMagnitude - 2}
        height="20px"
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
            <path d="M0,0 L0,6 L6,3 z" fill={arrowColor} />
          </marker>
        </defs>

        <line
          x1="0"
          y1="9"
          x2={arrowMagnitude - 20}
          y2="9"
          stroke={arrowColor}
          strokeWidth="3"
          markerEnd="url(#arrow)"
        />
      </svg>
    );
  }
}

export default connect(stateReturn.allState)(SvgArrow);
