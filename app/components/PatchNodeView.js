// @flow
import React from 'react';
// import { Route } from 'react-router-dom';

// click and drag derived from https://stackoverflow.com/questions/20926551/recommended-way-of-making-react-component-div-draggable

class PatchNodeView extends React.Component {
  constructor(props) {
    super(props);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleMouseDownForDrag = this.handleMouseDownForDrag.bind(this);
    this.handleClickMenu = this.handleClickMenu.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.renderDeleteButton = this.renderDeleteButton.bind(this);
    this.renderSetStartButton = this.renderSetStartButton.bind(this);
    this.renderMenuButton = this.renderMenuButton.bind(this);
    this.renderStartingStatus = this.renderStartingStatus.bind(this);
    this.classNames = this.classNames.bind(this);

    this.state = {
      menuVisible: false,
      linkCoordinates: [],
      didMouseDown1: false,
      deleting: false,
      dragging: false,
      relativeToClickPoint: {
        x: 0,
        y: 0
      },
      drifts: {
        x: [0, 0, 0, 0, 0, 0],
        y: [0, 0, 0, 0, 0, 0]
      }
    };
  }

  componentDidUpdate() {
    if (this.state.didMouseDown1) {
      document.addEventListener('mousemove', this.onMouseMove);
      document.addEventListener('mouseup', this.onMouseUp);
    } else if (!this.state.didMouseDown1) {
      document.removeEventListener('mousemove', this.onMouseMove);
      document.removeEventListener('mouseup', this.onMouseUp);
    }
  }

  handleClick(event) {
    if (!this.state.dragging) this.props.openPatchEdit();
    this.setState({ didMouseDown1: false, dragging: false });
  }

  handleMouseDownForDrag(event) {
    if (event.button !== 0 || this.state.deleting) return;
    this.props.bringToFront();
    this.setState({ didMouseDown1: true });
    document.body.style.cursor = '-webkit-grabbing';

    // record cursor click point offset, which will be used during the entire drag
    // initialize drifts to and array of 0s
    this.setState({
      relativeToClickPoint: {
        x: event.pageX - this.props.xPos,
        y: event.pageY - this.props.yPos
      },
      drifts: {
        x: [0, 0, 0, 0, 0, 0],
        y: [0, 0, 0, 0, 0, 0]
      }
    });

    event.stopPropagation();
    event.preventDefault();
  }

  clamp(num, min, max) {
    return num <= min ? min : num >= max ? max : num;
  }

  onMouseMove(event) {
    if (!this.state.didMouseDown1 || this.state.deleting) return;

    // save previous position and get updated position, based on where the mouse is

    let oldPos = {
      x: this.props.xPos,
      y: this.props.yPos
    };

    let newPos = {
      x: event.pageX - this.state.relativeToClickPoint.x,
      y: event.pageY - this.state.relativeToClickPoint.y
    };

    // determine change between old position and new position
    //  add this value into the drifts array
    //  so they can be later averaged out to rotate the node based on movement
    //  clamp so it doesn't get too wonky

    let newXDrift = this.clamp(newPos.x - oldPos.x, -100, 100);
    let newYDrift = this.clamp(newPos.y - oldPos.y, -100, 100);

    let newXDrifts = this.state.drifts.x.slice(1, this.state.drifts.x.length);
    newXDrifts.push(newXDrift);
    let newYDrifts = this.state.drifts.y.slice(1, this.state.drifts.y.length);
    newYDrifts.push(newYDrift);

    // let newXDrifts = this.state.drifts.x
    //   .slice(1, this.state.drifts.x.length)
    //   .push(newXDrift);

    // state update:
    //  - set dragging to true to prevent modal from opening after moving this patch node
    //  - updated the drifts
    this.setState({
      dragging: true,
      drifts: {
        x: newXDrifts,
        y: newYDrifts
      }
    });

    this.props.updatePosition(this.props.patchId, {
      x: newPos.x,
      y: newPos.y
    });

    // stop the click/dragging from triggering other interior actions
    event.stopPropagation();
    event.preventDefault();
  }

  onMouseUp(event) {
    setTimeout(() => {
      this.setState({ didMouseDown1: false, dragging: false });
      this.props.updatePosition(this.props.patchId, {
        x: 20 * Math.round(this.props.xPos / 20),
        y: 20 * Math.round(this.props.yPos / 20)
      });
    }, 0);
    document.body.style.cursor = 'inherit';
    event.stopPropagation();
    event.preventDefault();
  }

  handleKeyPress(target) {
    if (target.charCode == 13) {
      this.props.openPatchEdit();
    }
  }

  handleClickMenu() {
    this.setState({ menuVisible: !this.state.menuVisible });
  }

  renderDeleteButton() {
    return (
      <a
        className="delete-button"
        onClick={event => {
          event.stopPropagation();
          this.setState({
            menuVisible: false,
            deleting: true,
            didMouseDown1: false,
            dragging: false
          });
          this.props.deletePatch();
        }}
      >
        Delete this patch
      </a>
    );
  }

  renderSetStartButton() {
    if (this.props.isStartingPatch) {
      return (
        <span className="starting-patch-info">
          ▶︎ Starting patch: your story will begin here
        </span>
      );
    } else {
      return (
        <a
          className="set-starting-patch-button"
          onClick={event => {
            event.stopPropagation();
            this.setState({
              menuVisible: false,
              didMouseDown1: false,
              dragging: false
            });
            this.props.setStartPatch();
          }}
        >
          Set as starting patch
        </a>
      );
    }
  }

  renderMenuButton() {
    return (
      <a
        className="menu-button"
        onClick={event => {
          event.stopPropagation();
          this.handleClickMenu();
        }}
      >
        menu
      </a>
    );
  }

  renderStartingStatus() {
    if (this.props.isStartingPatch)
      return <span className="starting-patch-tag">Start</span>;
  }

  renderMenu() {
    if (this.state.menuVisible) {
      // QUESTION: remove this after clicking?
      // document.getElementsByTagName('body')[0].addEventListener('click', () => {
      //   this.setState({ menuVisible: false });
      // });
      return (
        <div
          className="patch-node-menu"
          onClick={event => {
            event.stopPropagation();
          }}
        >
          <ul>
            <li>{this.renderDeleteButton()}</li>
            <li>{this.renderSetStartButton()}</li>
          </ul>
        </div>
      );
    }
  }

  classNames() {
    let classes = ['patch-node'];
    if (this.state.didMouseDown1) classes.push('didMouseDown1');
    if (this.state.dragging) classes.push('dragging');
    return classes.join(' ');
  }

  render() {
    var regexp = /@([^:]+):(\d)/g;
    var match, matches = [];
    let links = [];

    while ((match = regexp.exec(this.props.body)) != null) {
      matches.push(match.index);
      links.push(match);
    }

    var draggingAngleStyle = () => {
      let yRotationScaler = -10;
      let xRotationScaler = 10;

      let sumX = 0;
      for (let i = 0; i < this.state.drifts.x.length; i++) {
        sumX += this.state.drifts.x[i];
      }
      let averagedXDrift = sumX / this.state.drifts.x.length;
      let clampedXDrift = this.clamp(averagedXDrift * yRotationScaler, -10, 10);

      let sumY = 0;
      for (let i = 0; i < this.state.drifts.y.length; i++) {
        sumY += this.state.drifts.y[i];
      }
      let averagedYDrift = sumY / this.state.drifts.y.length;
      let clampedYDrift = this.clamp(averagedYDrift * xRotationScaler, -10, 10);

      if (this.state.dragging) {
        return {
          transform: `rotateX(${clampedYDrift}deg) rotateY(${clampedXDrift}deg) translateY(${clampedYDrift * 0.08}em) translateX(${clampedXDrift * 0.08}em) scale(1.03)`
        };
      } else {
        return { appearance: 'none' }; // gotta return something to make JSX/React happy
      }
    };

    return (
      <div
        className={this.classNames()}
        id={`patch-node-${this.props.patchId}`}
        ref={`patchNode`}
        onKeyPress={this.handleKeyPress}
        onMouseDown={event => {
          this.handleMouseDownForDrag(event);
        }}
        onClick={event => {
          // event.preventDefault();
          // event.stopPropagation();
          // this.props.openPatchEdit();
          this.handleClick(event);
        }}
        style={{
          top: `${this.props.yPos / 10}rem`,
          left: `${this.props.xPos / 10}rem`,
          zIndex: `${this.props.z}`
        }}
        tabIndex="2"
      >
        <div className="patch-node-wrapper" style={draggingAngleStyle()}>
          <header className="patch-header">
            <h4 className="patch-title">{this.props.name}</h4>
          </header>
          <section className="patch-body">
            {this.props.body}
          </section>
          <footer className="patch-footer">
            <span className="patch-id">id: {this.props.patchId}</span>
            {/*this.renderDeleteButton()*/}
            {this.renderStartingStatus()}
            {this.renderMenuButton()}
            {this.renderMenu()}
          </footer>
        </div>
      </div>
    );
  }
}

/*
TODO: propTypes is deprecated,
consult docs for updated library
 */
// Patch.propTypes = {
//   id: React.PropTypes.string.isRequired,
//   name: React.PropTypes.string.isRequired,
//   body: React.PropTypes.string.isRequired
// };

export default PatchNodeView;
