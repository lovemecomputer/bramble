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

    if (
      this.props.bramble.patches[targetPatchIndex] === undefined ||
      this.props.bramble.patches[targetPatchIndex] === null
    ) {
      targetPosition.x = thisPosition.x + nodeWidth / 4 / 10;
      targetPosition.y = thisPosition.y;
      arrowColor = arrowNoTargetColor;
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

    arrowMagnitude -= nodeWidth / 0.9;
    if (arrowMagnitude < 0) arrowMagnitude *= -1;

    // console.log(arrowMagnitude);

    let facingAngle = Math.atan2(
      targetPosition.y - thisPosition.y,
      targetPosition.x - thisPosition.x
    );

    // sin wave reference: http://motionscript.com/articles/speed-control.html#frequency
    // let calculateDiagonalDistance = angle => {
    //   let freq = 1;
    //   let amp = (nodeWidth * 1.414 - nodeWidth) / 2;
    //   let number = nodeWidth / 2 + amp * Math.sin(Math.PI * freq * angle + 45);
    //   return number;
    // };

    var rotation = () => {
      // let adjustment = calculateDiagonalDistance(facingAngle);
      // console.log(adjustment);
      // return {
      //   transform: `rotatez(${facingAngle}rad) translateX(${adjustment / 10}rem)`,
      //   transformOrigin: 'left center'
      // };
      return {
        transform: `rotatez(${facingAngle}rad) translateX(${nodeWidth / 2.5 / 10}rem)`,
        transformOrigin: 'left center'
      };
      // return {
      //   transform: `rotatez(${facingAngle}rad)`,
      //   transformOrigin: 'left center'
      // };
    };

    return (
      <svg
        className="svg-arrow"
        width={arrowMagnitude}
        height="30px"
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
          y1="8"
          x2={arrowMagnitude - 20}
          y2="8"
          stroke={arrowColor}
          strokeWidth="3"
          markerEnd="url(#arrow)"
        />
      </svg>
    );
  }
}

export default connect(stateReturn.allState)(SvgArrow);
