import * as actionTypes from '../actions/actions';

const initialState = {
  provinces: null,
  loading: false,
  err: null,
  filteredProvince: []
};

const filterProvince = (target, state) => {
  let currentProvinces = [],
    newProvinces = [];
  if (target !== '') {
    currentProvinces = state;
    // eslint-disable-next-line array-callback-return
    newProvinces = currentProvinces.filter(province => {
      if (province.name !== null) {
        const ld = province.name.toLowerCase();
        const lt = target.toLowerCase();
        return ld.includes(lt);
      }
    });
  } else {
    newProvinces = state;
  }
  return newProvinces;
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
      case actionTypes.LOAD_PROVINCES_CARD_START:
          return Object.assign({}, state, {err: null, loading: true})
      case actionTypes.LOAD_PROVINCES_CARD_SUCCESS:
          return Object.assign({}, state, {
            provinces: action.cities.map(city => ({ ...city })),
            loading: false,
            err: null,
            filteredProvince: action.cities.map(city => ({ ...city }))
          });
      case actionTypes.LOAD_PROVINCES_CARD_FAILED:
          return Object.assign({}, state, {err: action.err, loading: false})
      case actionTypes.FILTER_PROVINCES_NAME:
          return Object.assign({}, state, {
            filteredProvince: filterProvince(action.target, state.provinces)
          });
      default:
        return state;
    }
}

export default reducer;