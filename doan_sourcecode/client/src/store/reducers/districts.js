import * as actionTypes from '../actions/actions';

const initialState = {
    districts: [],
    loading: false,
    err: null,
    filteredDistricts: []
}

const filterDistrict = (target, state) => {
    let currentDistricts = [], newDistricts = [];
    if(target !== ""){
        currentDistricts = state;
        // eslint-disable-next-line array-callback-return
        newDistricts = currentDistricts.filter(district => {
            if(district.districtname !== null){
                const ld = district.districtname.toLowerCase();
                const lt = target.toLowerCase();
                return ld.includes(lt);
            }
        })
    }
    else{
        newDistricts = state;
    }
    return newDistricts;
}

const reducer = (state = initialState, action) => {
    switch(action.type){
        case actionTypes.LOAD_DISTRICTS_NAME_START:
            return Object.assign({}, state, {loading: true, err: null})
        case actionTypes.LOAD_DISTRICTS_NAME_SUCCESS:
            return Object.assign({}, state, {
              err: null,
              loading: false,
              districts: action.districtsName.district,
              filteredDistricts: action.districtsName.district
            });
        case actionTypes.LOAD_DISTRICTS_NAME_FAILED:
            return Object.assign({}, state, {loading: false, err: action.err})
        case actionTypes.FILTER_DISTRICTS_NAME:
            filterDistrict(action.target, state.districts)
            return Object.assign({}, state, {
              filteredDistricts: filterDistrict(action.target, state.districts)
            });
        default: return state;
    }
}

export default reducer;