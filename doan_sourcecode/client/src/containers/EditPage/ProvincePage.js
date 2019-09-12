import React, { Component } from 'react';
import Map from '../Map/Map';
import queryString from 'query-string';
import {connect} from 'react-redux';
import * as actions from '../../store/actions/index';

class ProvincePage extends Component {
  componentDidMount(){
    const values = queryString.parse(this.props.location.search);
    const provinceName = this.props.match.params.provinceName;
    this.props.loadDistrictsData(values, provinceName);
  }

  render() {
    return (
      <Map zoom={10} />
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    loadDistrictsData: (values, provinceName) => dispatch(actions.loadDistrictsData(values, provinceName))
  };
}

export default connect(null, mapDispatchToProps)(ProvincePage);