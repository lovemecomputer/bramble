// @flow
import React from 'react';
// import { Route } from 'react-router-dom';

// click and drag derived from https://stackoverflow.com/questions/20926551/recommended-way-of-making-react-component-div-draggable

class PatchNodeView extends React.Component {
  constructor(props) {
    super(props);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleClickForDrag = this.handleClickForDrag.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.renderDeleteButton = this.renderDeleteButton.bind(this);
    this.renderMenuButton = this.renderMenuButton.bind(this);
    this.classNames = this.classNames.bind(this);
    this.state = {
      linkCoordinates: [],
      didMouseDown1: false,
      dragging: false,
      relative: {
        x: 0,
        y: 0
      } // position relative to the cursor
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
    console.log('>>>> TARGET', event.target);
    console.log(event.button);
    if (!this.state.dragging) this.props.openPatchEdit();
    this.setState({ didMouseDown1: false, dragging: false });
  }

  handleClickForDrag(event) {
    if (event.button !== 0) return;
    this.setState({ didMouseDown1: true });
    document.body.style.cursor = '-webkit-grabbing';
    var position = {
      x: this.refs.patchNode.offsetLeft,
      y: this.refs.patchNode.offsetTop
    };
    // console.log(
    //   '\n\n\n\n\n||||||||||| START CLICK |||||||||||||\n',
    //   '\nposition from offset\n',
    //   {
    //     x: this.refs.patchNode.offsetLeft,
    //     y: this.refs.patchNode.offsetTop
    //   },
    //   '\nSTATE POSITION \n',
    //   { x: this.props.xPos, y: this.props.yPos },
    //   '\nSTATE RELATIVE\n',
    //   this.state.relative
    // );
    this.setState({
      relative: {
        x: event.pageX - this.props.xPos,
        y: event.pageY - this.props.yPos
      }
    });
    event.stopPropagation();
    event.preventDefault();
  }

  onMouseMove(event) {
    // console.log(
    //   '\n\n\n>>> EVENT POSITION >>\n',
    //   { x: event.pageX, y: event.pageY },
    //   '\nSTATE POSITION \n',
    //   { x: this.props.xPos, y: this.props.yPos },
    //   '\nSTATE RELATIVE\n',
    //   this.state.relative
    // );
    if (!this.state.didMouseDown1) return;
    this.setState({ dragging: true });
    this.props.updatePosition(this.props.patchId, {
      x: event.pageX - this.state.relative.x,
      y: event.pageY - this.state.relative.y
    });
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

  renderDeleteButton() {
    return (
      <a
        className="delete-button"
        onClick={event => {
          event.stopPropagation();
          this.props.deletePatch();
        }}
      >
        delete
      </a>
    );
  }

  renderMenuButton() {
    return (
      <a
        className="menu-button"
        onClick={event => {
          event.stopPropagation();
        }}
      >
        menu
      </a>
    );
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

    console.log(matches);

    return (
      <div
        className={this.classNames()}
        id={`patch-node-${this.props.patchId}`}
        ref={`patchNode`}
        onKeyPress={this.handleKeyPress}
        onMouseDown={event => {
          this.handleClickForDrag(event);
        }}
        onClick={event => {
          // event.preventDefault();
          // event.stopPropagation();
          // this.props.openPatchEdit();
          this.handleClick(event);
        }}
        style={{
          top: `${this.props.yPos / 10}rem`,
          left: `${this.props.xPos / 10}rem`
        }}
        tabIndex="2"
      >
        <div className="patch-node-wrapper">
          <header className="patch-header">
            <h4 className="patch-title">{this.props.name}</h4>
          </header>
          <section className="patch-body">
            {this.props.body}
          </section>
          <footer className="patch-footer">
            <span className="patch-id">patch id: {this.props.patchId}</span>
            {/*this.renderDeleteButton()*/}
            {this.renderMenuButton()}
          </footer>
        </div>
        {links.map((link, index) => {
          return (
            <svg className="svg-arrow" key={index} width="600px" height="600px">
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
                x1="180"
                y1="0"
                x2="245"
                y2="50"
                stroke="rgba(128,117,138,.52)"
                strokeWidth="3"
                markerEnd="url(#arrow)"
              />
            </svg>
          );
        })}
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
