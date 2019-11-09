import React, { Component } from 'react';
import Cards from '../../components/Cards/Cards';
import Spinner from '../../components/Spinner/Spinner';
import {connect} from 'react-redux';
import * as actions from '../../store/actions/index';
import SearchBar from '../../components/SearchBar/SearchBar';

class Districts extends Component {
  componentDidMount() {
    this.props.loadDistrictName();
  }

  filterDistricts = (e) => {
    this.props.filterDistrictsName(e.target.value)
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
        <h1 style={{textAlign: 'center'}}>Provinces</h1>
        <SearchBar changed={this.filterDistricts}/>
        {cards}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    districts: state.districts.filteredDistricts
  };
}

const mapDispatchToProps = dispatch => {
  return {
    loadDistrictName: () => dispatch(actions.loadDistrictsName()),
    filterDistrictsName: (target) => dispatch(actions.filterDistrictsName(target))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Districts);