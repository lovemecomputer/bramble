// @flow
import React from 'react';

class Patch extends React.Component {
  render() {
    return (
      <div className="patch-preview">
        <header>
          <h4 className="patch-title">{this.props.name}</h4>
        </header>
        <section className="patch-body">
          {this.props.body}
        </section>
        <footer className="patch-footer">
          {this.props.id}
        </footer>
      </div>
    );
  }
}

/* TODO: propTypes is deprecated? */
Patch.propTypes = {
  id: React.PropTypes.string.isRequired,
  name: React.PropTypes.string.isRequired,
  body: React.PropTypes.string.isRequired
};

export default Patch;
