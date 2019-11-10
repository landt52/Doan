import React, { Component } from 'react';
import Map from '../Map/Map';
import queryString from 'query-string';
import {connect} from 'react-redux';
import * as actions from '../../store/actions/index';
import InfoDiv from '../../components/InfoDiv/InfoDiv';
import Auxiliary from '../../hoc/Auxiliary/Auxiliary';

class ProvincePage extends Component {
  componentDidMount(){
    const values = queryString.parse(this.props.location.search);
    const provinceName = this.props.match.params.provinceName;
    this.props.loadDistrictsData(values, provinceName);
  }

  click = (event) => {
    this.props.filterDistrictsData(event.target.textContent)
  }

  render() {
    return (
      <Auxiliary>
        <InfoDiv
          data={this.props.data}
          onclicked={this.click}
          fetched={this.props.fetched}
        />
        <Map zoom={9} provinceName={this.props.provinceName} />
      </Auxiliary>
    );
  }
}

const mapStateToProps = state => {
  return {
    data: state.map.boundary.boundaries,
    fetched: state.map.fetched,
    provinceName: state.map.provinceName
  }
}

const mapDispatchToProps = dispatch => {
  return {
    loadDistrictsData: (values, provinceName) => dispatch(actions.loadDistrictsData(values, provinceName)),
    filterDistrictsData: (value) => dispatch(actions.filterDistrictsData(value))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProvincePage);