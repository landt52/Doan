import * as actions from '../actions/actions';

const initialState = {
    loading: false,
    error: '',
    locations: [],
    types: [],
    currentType: '',
    locationSelected: {},
    locationSelectedInfo: {},
    id: null
}

const reducer = (state = initialState, action) => {
    switch(action.type){
        case actions.GET_LOCATIONS_START:
            return Object.assign({}, state, {loading: true, error: ''});
        case actions.GET_TYPES_SUCCESS:
            return Object.assign({}, state, {loading: false, error: '', types: action.types.map((type) => (
                type === 'Default' ? 'Other' : type
            ))});
        case actions.GET_LOCATIONS_SUCCESS:
            return Object.assign({}, state, {loading: false, error: '', locations: action.data, currentType: action.currentType});
        case actions.GET_LOCATIONS_FAILED:
            return Object.assign({}, state, {loading: false, error: action.error});
        case actions.LOCATION_SELECTED:
            return Object.assign({}, state, {locationSelected: action.result})
        case actions.GET_LOCATION_INFO:
            return Object.assign({}, state, {id: action.id, locationSelectedInfo: action.info})
        default:
            return state;
    }
}

export default reducer;