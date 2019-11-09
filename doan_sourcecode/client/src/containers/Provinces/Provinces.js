import React, { Component } from 'react';
import Cards from '../../components/Cards/Cards';
import Spinner from '../../components/Spinner/Spinner';
import {connect} from 'react-redux'; 
import * as actionTypes from '../../store/actions/index';
import SearchBar from '../../components/SearchBar/SearchBar';

class Provinces extends Component {
  componentDidMount() {
    this.props.loadProvincesCardData();
  }

  filterProvinces = e => {
    this.props.filterProvincesName(e.target.value);
  };

  render() {
    let cards = this.props.err ? <p>Có lỗi xảy ra</p> : <Spinner />;

    if (this.props.provinces !== null)
      cards = (
        <Cards
          data={this.props.provinces}
          type={'provinces'}
          role={this.props.role}
        />
      );
    return (
      <div>
        <h1 style={{ textAlign: 'center' }}>Provinces</h1>
        <SearchBar changed={this.filterProvinces} />
        {cards}
      </div>
    );
  }
}

const mapStateToProps = state => {
    return {
      provinces: state.provinces.filteredProvince,
      err: state.provinces.err,
      loading: state.provinces.loading,
      role: state.auth.role
    };
}

const mapDispatchToProps = dispatch => {
    return {
        loadProvincesCardData: () => dispatch(actionTypes.loadProvincesCardData()),
        filterProvincesName: (target) => (dispatch(actionTypes.filterProvincesName(target)))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Provinces);