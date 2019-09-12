import React, { Component } from 'react';
import Cards from '../../components/Cards/Cards';
import Spinner from '../../components/Spinner/Spinner';
import {connect} from 'react-redux';
import * as actions from '../../store/actions/index';

class Districts extends Component {
  componentDidMount() {
    this.props.loadDistrictName();
  }

  render() {
    let cards = <Spinner />;
    if (this.props.districts !== null)
      cards = (
        <Cards
          data={this.props.districts}
          type={"districts"}
        />
      );
      
    return (
      <div>
        <h1>Provinces</h1>
        {cards}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    districts: state.districts.districts
  }
}

const mapDispatchToProps = dispatch => {
  return {
    loadDistrictName: () => dispatch(actions.loadDistrictsName())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Districts);