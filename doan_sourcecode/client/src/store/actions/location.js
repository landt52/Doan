import * as actions from './actions';
import axios from 'axios';

export const getLocationsStart = () => {
    return {
        type: actions.GET_LOCATIONS_START
    }
}

export const getTypesSuccess = (types) => {
    return {
        type: actions.GET_TYPES_SUCCESS,
        types
    }
}

export const getLocationsSuccess = (data) => {
    return {
        type: actions.GET_LOCATIONS_SUCCESS,
        data
    }
}

export const getInfoFailed = (err) => {
    return {
        type: actions.GET_LOCATIONS_FAILED,
        error: err
    }
}

export const getAllLocations = (type) => async dispatch => {
    dispatch(getLocationsStart());
    try {
        if(!type){
            const types = await axios('/api/location/types/types');
            const locations = await axios(
            `/api/location/type/${types.data.locationTypes[0]}`
            );
            dispatch(getTypesSuccess(types.data.locationTypes));
            dispatch(getLocationsSuccess(locations.data.locations));
        }else{
            
        }
    } catch (error) {
        dispatch(getInfoFailed(error));
    }  
}