import * as actionTypes from './actions';
import axios from 'axios';

export const loadMapOfVNStart = () => {
    return {
        type: actionTypes.LOAD_MAP_OF_VN_START
    }
}

export const loadMapOfVNSuccess = (vnBoundaries) => {
    return {
        type: actionTypes.LOAD_MAP_OF_VN_SUCCESS,
        boundary: vnBoundaries.data
    }
}

export const loadMapOfVNFailed = err => {
  return {
    type: actionTypes.LOAD_MAP_OF_VN_FAILED,
    err: err
  };
};

export const loadMapOfVN = () => dispatch => {
    dispatch(loadMapOfVNStart());
    axios(`/api/vnBoundaries`)
    .then(res => dispatch(loadMapOfVNSuccess(res)))
    .catch(err => dispatch(loadMapOfVNFailed(err)))
    axios(`/api/icons`)
      .then(res => dispatch(loadIconsSuccess(res)))
      .catch(err => dispatch(loadIconsFailed(err)));
};

export const loadDistrictDataStart = () => {
    return {
        type: actionTypes.LOAD_DISTRICTS_DATA_START
    }
}

export const loadDistrictDataSuccess = (values, districtData) => {
    return {
        type: actionTypes.LOAD_DISTRICTS_DATA_SUCCESS,
        lat: values.lat,
        lng: values.lng,
        boundary: districtData.data
    }
}

export const loadDistrictDataFailed = err => {
  return {
    type: actionTypes.LOAD_DISTRICTS_DATA_FAILED,
    err: err
  };
};

export const loadDistrictsData = (values, provinceName) => dispatch => {
    dispatch(loadDistrictDataStart());
    axios(`/api/vnBoundaries/${provinceName}`)
    .then(res => dispatch(loadDistrictDataSuccess(values, res)))
    .catch(err => dispatch(loadDistrictDataFailed(err)))
    axios(`/api/icons`)
      .then(res => dispatch(loadIconsSuccess(res)))
      .catch(err => dispatch(loadIconsFailed(err)));
};

export const filterDistrictsData = (value) => {
    return {
        type: actionTypes.FILTER_DISTRICTS_DATA,
        filterData: value
    }
}

export const loadIconsSuccess = (icons) => {
    return {
        type: actionTypes.LOAD_ICONS_SUCCESS,
        icons: icons.data.icons
    }
}

export const loadIconsFailed = (err) => {
    return {
        type: actionTypes.LOAD_ICONS_FAILED,
        err
    }
}