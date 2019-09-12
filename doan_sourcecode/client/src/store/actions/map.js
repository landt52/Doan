import * as actionTypes from './actions';
import axios from 'axios';

export const loadMapOfVNStart = () => {
    return {
        type: actionTypes.LOAD_MAP_OF_VN_START
    }
}

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
    type: actionTypes.LOAD_PROVINCES_CARD_FAILED,
    err: err
  };
};

export const loadDistrictsData = (values, provinceName) => dispatch => {
    dispatch(loadDistrictDataStart());
    axios(`/api/vnBoundaries/${provinceName}`)
    .then(res => dispatch(loadDistrictDataSuccess(values, res)))
    .catch(err => dispatch(loadDistrictDataFailed(err)))
};