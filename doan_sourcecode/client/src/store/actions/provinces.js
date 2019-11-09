import * as actionTypes from './actions';
import axios from 'axios';

export const loadProvincesCardStart = () => {
    return {
        type: actionTypes.LOAD_PROVINCES_CARD_START
    }
}

export const loadProvincesCardSuccess = (provincesCardData) => {
    return {
        type: actionTypes.LOAD_PROVINCES_CARD_SUCCESS,
        cities: provincesCardData.data.cities,
    }
}

export const loadProvincesCardFailed = (err) => {
    return {
        type: actionTypes.LOAD_PROVINCES_CARD_FAILED,
        err: err
    }
}

export const loadProvincesCardData = () => dispatch => {
    dispatch(loadProvincesCardStart());
    axios('/api/citiesName').then(res => {
        dispatch(loadProvincesCardSuccess(res))
    }).catch(err => {
        dispatch(loadProvincesCardFailed(err))
    })
}

export const filterProvincesName = target => {
  return {
    type: actionTypes.FILTER_PROVINCES_NAME,
    target
  };
};
