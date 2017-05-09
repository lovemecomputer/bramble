// @flow
import React from 'react';
// import { Route } from 'react-router-dom';

// click and drag derived from https://stackoverflow.com/questions/20926551/recommended-way-of-making-react-component-div-draggable

class PatchPreview extends React.Component {
  constructor(props) {
    super(props);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleClickForDrag = this.handleClickForDrag.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.renderDeleteButton = this.renderDeleteButton.bind(this);
    this.classNames = this.classNames.bind(this);
    this.state = {
      dragging: false,
      position: {
        x: this.props.xPos,
        y: this.props.yPos
      },
      relative: {
        x: 0,
        y: 0
      } // position relative to the cursor
    };
  }

  componentDidUpdate() {
    if (this.state.dragging) {
      document.addEventListener('mousemove', this.onMouseMove);
      document.addEventListener('mouseup', this.onMouseUp);
    } else if (!this.state.dragging) {
      document.removeEventListener('mousemove', this.onMouseMove);
      document.removeEventListener('mouseup', this.onMouseUp);
    }
  }

  handleClickForDrag(event) {
    if (event.button !== 0) return;
    var position = {
      x: this.refs.patchPreview.offsetLeft,
      y: this.refs.patchPreview.offsetTop
    };
    console.log(
      '\n\n\n\n\n||||||||||| START CLICK |||||||||||||\n',
      '\nposition from offset\n',
      {
        x: this.refs.patchPreview.offsetLeft,
        y: this.refs.patchPreview.offsetTop
      },
      '\nSTATE POSITION \n',
      this.state.position,
      '\nSTATE RELATIVE\n',
      this.state.relative
    );
    this.setState({
      dragging: true,
      relative: {
        x: event.pageX - this.state.position.x,
        y: event.pageY - this.state.position.y
      }
    });
    console.log('>>> check in after setting::: \n', this.state.position.y);
    event.stopPropagation();
    event.preventDefault();
  }

  onMouseMove(event) {
    console.log(
      '\n\n\n>>> EVENT POSITION >>\n',
      { x: event.pageX, y: event.pageY },
      '\nSTATE POSITION \n',
      this.state.position,
      '\nSTATE RELATIVE\n',
      this.state.relative
    );
    if (!this.state.dragging) return;
    this.setState({
      position: {
        x: event.pageX - this.state.relative.x,
        y: event.pageY - this.state.relative.y
      }
    });
    event.stopPropagation();
    event.preventDefault();
  }

  onMouseUp(event) {
    this.setState({ dragging: false });
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

  classNames() {
    let classes = ['patch-preview'];
    if (this.state.dragging) classes.push('dragging');
    return classes.join(' ');
  }

  render() {
    if (this.state.dragging) {
      document.body.style.cursor = '-webkit-grabbing'; // only safe because Electron is webkit
    }
    //onClick={this.props.openPatchEdit}
    return (
      <div
        className={this.classNames()}
        id={`patch-preview-${this.props.patchId}`}
        ref={`patchPreview`}
        onKeyPress={this.handleKeyPress}
        onMouseDown={event => {
          this.handleClickForDrag(event);
        }}
        style={{
          top: this.state.position.y,
          left: this.state.position.x
        }}
        tabIndex="2"
      >
        <div className="patch-preview-wrapper">
          <header>
            <h4 className="patch-title">{this.props.name}</h4>
          </header>
          <section className="patch-body">
            {this.props.body}
          </section>
          <footer className="patch-footer">
            <span className="patch-id">patch id: {this.props.patchId}</span>
            {this.renderDeleteButton()}
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

export default PatchPreview;
