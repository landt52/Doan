import * as actionsType from './actions';
import axios from 'axios';

export const loadProvinceDataStart = () => {
    return {
        type: actionsType.LOAD_PROVINCE_DATA_START
    }
}

export const loadProvinceDataSuccess = (data) => {
    return {
        type: actionsType.LOAD_PROVINCE_DATA_SUCCESS,
        data
    }
}

export const loadProvinceDataFailed = (err) => {
    return {
        type: actionsType.LOAD_PROVINCE_DATA_FAILED,
        err
    }
}

export const loadProvinceData = (type, value) => dispatch => {
    dispatch(loadProvinceDataStart());
    axios(`/api/${type}/data/${value}`)
    .then(res => { dispatch(loadProvinceDataSuccess(res))})
    .catch(err => dispatch(loadProvinceDataFailed(err)))
}