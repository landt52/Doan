import * as actions from '../actions/actions';

const initialState = {
    loading: false,
    jwt: '',
    userName: '',
    photo: '',
    role: '',
    redirect: ''
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.AUTH_START:
            return Object.assign({}, state, {loading: true})
        case actions.AUTH_SUCCESS:
            return Object.assign({}, state, {
                jwt: action.jwt,
                role: action.role,
                loading: false, 
                userName: action.userName,
                photo: action.photo,
            })
        case actions.AUTH_FAILED:
            return Object.assign({}, state, {loading: false})
        case actions.SET_AUTH_REDIRECT:
            return Object.assign({}, state, {redirect: '/'})
        case actions.AUTH_LOGOUT:
            return Object.assign({}, state, {
              jwt: '',
              userName: '',
              photo: '',
              role: ''
            });
        default: return state;
    }
}

export default reducer;