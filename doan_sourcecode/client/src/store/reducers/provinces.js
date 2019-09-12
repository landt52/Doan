import * as actionTypes from '../actions/actions';

const initialState = {
    provinces: null,
    loading: false,
    err: null
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
      case actionTypes.LOAD_PROVINCES_CARD_START:
          return Object.assign({}, state, {err: null, loading: true})
      case actionTypes.LOAD_PROVINCES_CARD_SUCCESS:
          return Object.assign({}, state, {
              provinces: action.cities.map(city => ({...city})),
              loading: false,
              err: null
          })
      case actionTypes.LOAD_PROVINCES_CARD_FAILED:
          return Object.assign({}, state, {err: action.err, loading: false})
      default:
        return state;
    }
}

export default reducer;