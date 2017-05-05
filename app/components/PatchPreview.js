// @flow
import React from 'react';
// import { Route } from 'react-router-dom';

class PatchPreview extends React.Component {
  constructor(props) {
    super(props);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.renderDeleteButton = this.renderDeleteButton.bind(this);
  }

  handleKeyPress(target) {
    if (target.charCode == 13) {
      this.props.openPatchEdit();
    }
  }

  handleDeleteClick(deleteFunction, eventToStop) {
    deleteFunction();
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
  render() {
    return (
      <div
        className="patch-preview"
        id={`patch-preview-${this.props.patchId}`}
        onClick={this.props.openPatchEdit}
        onKeyPress={this.handleKeyPress}
        tabIndex="2"
      >
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
