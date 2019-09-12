import React, { Component } from 'react';
import Map from '../Map/Map';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/index';

class VNPage extends Component {
  componentDidMount() {
    this.props.loadMapOfVN();
  }

  render() {
    return <Map zoom={6} />;
  }
}

const mapDispatchToProps = dispatch => {
  return {
    loadMapOfVN: () => dispatch(actions.loadMapOfVN())
  };
};

export default connect(
  null,
  mapDispatchToProps
)(VNPage);
