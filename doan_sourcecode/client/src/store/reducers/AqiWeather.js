import * as actionTypes from '../actions/actions';

const initialState = {
    aqi: [],
    loading: false,
    err: null
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.LOAD_AQI_DATA_START:
            return Object.assign({}, state, {
                err: null,
                loading: true
            })
        case actionTypes.LOAD_AQI_DATA_SUCCESS:
            return Object.assign({}, state, {
                err: null,
                loading: false,
                fetched: true,
                aqi: state.aqi.concat(action.aqiData)
            })
        case actionTypes.LOAD_AQI_DATA_FAILED:
            return Object.assign({}, state, {
                err: action.err,
                loading: false
            })
        default:
            return state;
    }
}

export default reducer;