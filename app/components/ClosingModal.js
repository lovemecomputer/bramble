// @flow
import React from 'react';
// import { Route } from 'react-router-dom';

// click and drag derived from https://stackoverflow.com/questions/20926551/recommended-way-of-making-react-component-div-draggable

class ClosingModal extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    console.log('CLOSING MOUNTED');
    setTimeout(() => {
      console.log('TIMINGOUT');
      this.props.history.push('/patchboard');
    }, 200);
  }

  render() {
    return <span />;
  }
}

export default ClosingModal;
