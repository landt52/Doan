import * as actionsType from '../actions/actions';

const initialState = {
    provinceData: null,
    loading: false,
    err: false,
    fetched: false
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionsType.LOAD_PROVINCE_DATA_START:
            return Object.assign({}, state, {loading: true, err: false})
        case actionsType.LOAD_PROVINCE_DATA_SUCCESS:
            return Object.assign({}, state, {loading: false, provinceData: action.data, fetched: true, err: false})
        case actionsType.LOAD_PROVINCE_DATA_FAILED:
            return Object.assign({}, state, {loading: false, err: true})
        default:
            return state;
    }
}

export default reducer