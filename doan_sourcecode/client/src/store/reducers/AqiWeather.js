import * as actionTypes from '../actions/actions';

const initialState = {
    aqi: [],
    weather: [],
    loading: false,
    err: null,
    type: '',
    openModal: false,
    properties: ''
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
      case actionTypes.LOAD_AQI_DATA_START:
        return Object.assign({}, state, {
          err: null,
          loading: true
        });
      case actionTypes.LOAD_AQI_DATA_SUCCESS:
        return Object.assign({}, state, {
          err: null,
          loading: false,
          fetched: true,
          aqi: action.aqiData
        });
      case actionTypes.LOAD_AQI_DATA_FAILED:
        return Object.assign({}, state, {
          err: action.err,
          loading: false
        });
      case actionTypes.LOAD_WEATHER_DATA_START:
        return Object.assign({}, state, {
          err: null,
          loading: true,
        });
      case actionTypes.LOAD_WEATHER_DATA_SUCCESS:
        return Object.assign({}, state, {
          err: null,
          loading: false,
          fetched: true,
          weather: action.weatherData
        });
      case actionTypes.LOAD_WEATHER_DATA_FAILED:
        return Object.assign({}, state, {
          err: action.err,
          loading: false
        });
      case actionTypes.CHANGE_TYPE:
        return Object.assign({}, state, {type: action.locationType})
      case actionTypes.OPEN_MODAL:
        return Object.assign({}, state, {openModal: true, properties: action.properties})
      case actionTypes.CLOSE_MODAL:
        return Object.assign({}, state, {openModal: false, properties: ''})
      default:
        return state;
    }
}

export default reducer;