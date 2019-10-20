import * as actions from '../actions/actions';

const initialState = {
    loading: false,
    error: '',
    locations: [],
    types: []
}

const reducer = (state = initialState, action) => {
    switch(action.type){
        case actions.GET_LOCATIONS_START:
            return Object.assign({}, state, {loading: true, error: ''});
        case actions.GET_TYPES_SUCCESS:
            return Object.assign({}, state, {loading: false, error: '', types: state.types.concat(action.types)});
        case actions.GET_LOCATIONS_SUCCESS:
            return Object.assign({}, state, {loading: false, error: '', locations: state.locations.concat(action.data)});
        case actions.GET_LOCATIONS_FAILED:
            return Object.assign({}, state, {loading: false, error: action.error});
        default:
            return state;
    }
}

export default reducer;