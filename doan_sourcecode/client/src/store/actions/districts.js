import * as actionsType from './actions';
import axios from 'axios';

export const loadDistrictsNameStart = () => {
    return {
        type: actionsType.LOAD_DISTRICTS_NAME_START
    }
}

export const loadDistrictsNameSuccess = (districtsName) => {
    return {
        type: actionsType.LOAD_DISTRICTS_NAME_SUCCESS,
        districtsName: districtsName.data
    }
}

export const loadDistrictsNameFailed = (err) => {
    return {
        type: actionsType.LOAD_DISTRICTS_NAME_FAILED,
        err: err
    }
}

export const loadDistrictsName = () => dispatch => {
    dispatch(loadDistrictsNameStart());
    axios('/api/districtsName').then(res => dispatch(loadDistrictsNameSuccess(res)))
    .catch(err => dispatch(loadDistrictsNameFailed(err)));
}

export const filterDistrictsName = (target) =>{
    return {
        type: actionsType.FILTER_DISTRICTS_NAME,
        target
    }
}