import * as actionTypes from '../actions/actions';

const initialState = {
    districts: [],
    loading: false,
    err: null
}

const reducer = (state = initialState, action) => {
    switch(action.type){
        case actionTypes.LOAD_DISTRICTS_NAME_START:
            return Object.assign({}, state, {loading: true, err: null})
        case actionTypes.LOAD_DISTRICTS_NAME_SUCCESS:
            return Object.assign({}, state, {
              err: null,
              loading: false,
              districts: action.districtsName.district
            });
        case actionTypes.LOAD_DISTRICTS_NAME_FAILED:
            return Object.assign({}, state, {loading: false, err: action.err})
        default: return state;
    }
}

export default reducer;