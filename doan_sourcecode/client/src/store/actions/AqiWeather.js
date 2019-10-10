import * as actionTypes from './actions';
import axios from 'axios';

export const loadAqiDataStart = () => {
    return {
        type: actionTypes.LOAD_AQI_DATA_START
    }
}

export const loadAqiDataSuccess = (aqiData) => {
    return {
        type: actionTypes.LOAD_AQI_DATA_SUCCESS,
        aqiData
    }
}

export const loadAqiDataFailed = (err) => {
    return {
        type: actionTypes.LOAD_AQI_DATA_FAILED,
        err
    }
}

export const loadAqiData = () => dispatch => {
    dispatch(loadAqiDataStart());
    axios(`/api/aqi`)
        .then(res => dispatch(loadAqiDataSuccess(res.data.aqi)))
        .catch(err => dispatch(loadAqiDataFailed(err)))
}

export const loadWeatherDataStart = () => {
    return {
        type: actionTypes.LOAD_WEATHER_DATA_START
    }
}

export const loadWeatherDataSuccess = (weatherData) => {
    return {
        type: actionTypes.LOAD_WEATHER_DATA_SUCCESS,
        weatherData
    }
}

export const loadWeatherDataFailed = (err) => {
    return {
        type: actionTypes.LOAD_WEATHER_DATA_FAILED,
        err
    }
}

export const loadWeatherData = () => dispatch => {
    dispatch(loadWeatherDataStart());
    axios(`/api/weather`)
        .then(res => dispatch(loadWeatherDataSuccess(res.data.weather)))
        .catch(err => dispatch(loadWeatherDataFailed(err)))
}

export const changeType = (locationType) => {
    return {
        type: actionTypes.CHANGE_TYPE,
        locationType
    }
}

export const openModal = (data) => {
    return {
        type: actionTypes.OPEN_MODAL,
        properties: data
    }
}

export const closeModal = () => {
    return {
        type: actionTypes.CLOSE_MODAL
    }
}