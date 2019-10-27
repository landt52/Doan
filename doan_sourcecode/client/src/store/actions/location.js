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

export const getLocationsSuccess = (data, type) => {
    return {
        type: actions.GET_LOCATIONS_SUCCESS,
        data,
        currentType: type
    }
}

export const getInfoFailed = (err) => {
    return {
        type: actions.GET_LOCATIONS_FAILED,
        error: err
    }
}

export const getAllLocations = () => async dispatch => {
    dispatch(getLocationsStart());
    try {
        const types = await axios('/api/location/types/types');
        dispatch(getTypesSuccess(types.data.locationTypes));
        for(let type of types.data.locationTypes){
            const locations = await axios(
              `/api/location/type/${type}`
            );
            dispatch(getLocationsSuccess(locations.data.locations, type));
        }
    } catch (error) {
        dispatch(getInfoFailed(error));
    }  
}

export const selectedLocation = (result) => {
    return {
        type: actions.LOCATION_SELECTED,
        result
    }
}

export const getLocationInfo = (id, info) => {
    return {
        type: actions.GET_LOCATION_INFO,
        id, 
        info
    }
}