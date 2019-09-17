import * as actionTypes from '../actions/actions';

const initialState = {
  lat: 16.830832,
  lng: 107.067261,
  boundary: [],
  loading: false,
  err: null,
  fetched: false,
  vnfetched: false,
  filterData: ''
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOAD_MAP_OF_VN_START:
      return Object.assign({}, state, {
        err: null,
        loading: true,
        vnfetched: false,
        fetched: false,
        filterData: null
      });
    case actionTypes.LOAD_MAP_OF_VN_SUCCESS:
      return Object.assign({}, state, {
        boundary: action.boundary,
        loading: false,
        lat: 16.830832,
        lng: 107.067261,
        err: null,
        vnfetched: true,
        filterData: 'Mật độ dân số (n/km2)'
      });
    case actionTypes.LOAD_MAP_OF_VN_FAILED:
      return Object.assign({}, state, {
        err: action.err,
        loading: false,
        vnfetched: false,
        fetched: false,
        filterData: null
      });
    case actionTypes.LOAD_DISTRICTS_DATA_START:
      return Object.assign({}, state, {
        err: null,
        loading: true,
        vnfetched: false,
        fetched: false,
        filterData: null
      });
    case actionTypes.LOAD_DISTRICTS_DATA_SUCCESS:
      return Object.assign({}, state, {
        boundary: action.boundary,
        lat: action.lat,
        lng: action.lng,
        loading: false,
        err: null,
        fetched: true,
        filterData: 'Mật độ dân số (n/km2)'
      });
    case actionTypes.LOAD_DISTRICTS_DATA_FAILED:
      return Object.assign({}, state, {
        err: action.err,
        loading: false,
        fetched: false,
        vnfetched: false,
        filterData: null
      });
    case actionTypes.FILTER_DISTRICTS_DATA:
      return Object.assign({}, state, { filterData: action.filterData });
    default:
      return state;
  }
};

export default reducer;
