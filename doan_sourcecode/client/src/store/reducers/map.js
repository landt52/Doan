import * as actionTypes from '../actions/actions';

const initialState = {
  lat: 16.830832,
  lng: 107.067261,
  boundary: [],
  loading: false,
  err: null,
  fetched: false,
  filterData: 'Dân số thành thị (1000 n)'
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOAD_MAP_OF_VN_START:
      return Object.assign({}, state, { err: null, loading: true });
    case actionTypes.LOAD_MAP_OF_VN_SUCCESS:
      return Object.assign({}, state, {
        boundary: action.boundary,
        loading: false,
        lat: 16.830832,
        lng: 107.067261,
        err: null,
      });
    case actionTypes.LOAD_MAP_OF_VN_FAILED:
      return Object.assign({}, state, { err: action.err, loading: false });
    case actionTypes.LOAD_DISTRICTS_DATA_START:
      return Object.assign({}, state, { err: null, loading: true, fetched: false });
    case actionTypes.LOAD_DISTRICTS_DATA_SUCCESS:
      return Object.assign({}, state, {
        boundary: action.boundary,
        lat: action.lat,
        lng: action.lng,
        loading: false,
        err: null,
        fetched: true
      });
    case actionTypes.LOAD_DISTRICTS_DATA_FAILED:
      return Object.assign({}, state, {
        err: action.err,
        loading: false,
        fetched: false
      });
    case actionTypes.FILTER_DISTRICTS_DATA:
      return Object.assign({}, state, {filterData: action.filterData})
    default:
      return state;
  }
};

export default reducer;
