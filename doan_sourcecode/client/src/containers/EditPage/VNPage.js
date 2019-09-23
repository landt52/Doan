import React, { Component } from 'react';
import Map from '../Map/Map';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/index';
import InfoDiv from '../../components/InfoDiv/InfoDiv';
import Auxiliary from '../../hoc/Auxiliary/Auxiliary';

class VNPage extends Component {
  componentDidMount() {
    this.props.loadMapOfVN();
  }

  click = event => {
    this.props.filterDistrictsData(event.target.textContent);
  };

  render() {
    return (
      <Auxiliary>
        <InfoDiv
          data={this.props.data}
          onclicked={this.click}
          fetched={this.props.vnfetched}
        />
        <Map zoom={6} />
      </Auxiliary>
    );
  }
}

const mapStateToProps = state => {
  return {
    data: state.map.boundary.boundaries,
    vnfetched: state.map.vnfetched
  };
}

const mapDispatchToProps = dispatch => {
  return {
    loadMapOfVN: () => dispatch(actions.loadMapOfVN()),
    filterDistrictsData: value => dispatch(actions.filterDistrictsData(value))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VNPage);
