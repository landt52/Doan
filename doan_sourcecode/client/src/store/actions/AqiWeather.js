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