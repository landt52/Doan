import * as actions from './actions';
import axios from 'axios';
import { toast } from 'react-toastify';

export const authStart = () => {
    return {
      type: actions.AUTH_START
    };
}

export const authSuccess = (res) => {
    return {
        type: actions.AUTH_SUCCESS,
        userName: res.userName,
        role: res.role,
        jwt: res.jwt,
        photo: res.photo,
        id: res.id
    }
}

export const authFailed = (err) => {
    toast.error(err)
    return {
        type: actions.AUTH_FAILED
    }
}

export const logOutSuccess = () => {
   return {
     type: actions.AUTH_LOGOUT
   };
}

export const logOut = () => dispatch => {
  localStorage.clear();
  axios('/api/user/logout').then(() => dispatch(logOutSuccess()))
    .catch(err => toast.error('Có lỗi xảy ra khi log out'))
};

export const checkAuthTimeout = expirationTime => dispatch => {
  setTimeout(() => {
    dispatch(logOut());
  }, expirationTime);
};

export const auth = (email, password) => dispatch => {
    dispatch(authStart());
    axios({
        method: 'POST',
        url: '/api/user/login',
        data: {email, password}
    })
        .then(res => {
            const expirationDate = new Date(
              new Date().getTime() + 24 * 60 * 60 * 1000
            );
            localStorage.setItem('jwt', res.data.token);
            localStorage.setItem('expirationDate', expirationDate);
            localStorage.setItem('userName', res.data.data.user.userName);
            localStorage.setItem('photo', res.data.data.user.photo);
            localStorage.setItem('id', res.data.data.user._id)

            const data = {
              jwt: res.data.token,
              userName: res.data.data.user.userName,
              photo: res.data.data.user.photo,
              role: res.data.data.user.role,
              id: res.data.data.user._id
            };
            dispatch(authSuccess(data));
            dispatch(checkAuthTimeout(24 * 60 * 60 * 1000));
            dispatch(setAuthRedirect());
        })
        .catch(err => dispatch(authFailed(err.response.data.message)))
}

export const signup = (userName, email, password, passwordConfirm) => dispatch => {
  dispatch(authStart())
  axios({
    method: 'POST',
    url: '/api/user/signup',
    data: {
      userName,
      email,
      password,
      passwordConfirm
    }
  })
    .then(res => {
      const expirationDate = new Date(
        new Date().getTime() + 24 * 60 * 60 * 1000
      );
      localStorage.setItem('jwt', res.data.token);
      localStorage.setItem('expirationDate', expirationDate);
      localStorage.setItem('userName', res.data.data.user.userName);
      localStorage.setItem('photo', res.data.data.user.photo);
      localStorage.setItem('id', res.data.data.user._id)

      const data = {
        jwt: res.data.token,
        userName: res.data.data.user.userName,
        photo: res.data.data.user.photo,
        role: res.data.data.user.role,
        id: res.data.data.user._id
      };
      dispatch(authSuccess(data));
      dispatch(checkAuthTimeout(24 * 60 * 60 * 1000));
      dispatch(setAuthRedirect())
    })
    .catch(err => dispatch(authFailed(err.response.data.message)));
}

export const setAuthRedirect = () => {
  return {
    type: actions.SET_AUTH_REDIRECT
  }
}

export const authCheckState = () => dispatch => {
  const jwt = localStorage.getItem('jwt');
  if (!jwt) {
    dispatch(logOut());
  } else {
    const expirationDate = new Date(localStorage.getItem('expirationDate'));
    if (expirationDate <= new Date()) {
      dispatch(logOut());
    } else {
      const userName = localStorage.getItem('userName');
      const photo = localStorage.getItem('photo');

      axios('/api/user/getRole').then(res => {
        const data = { userName, photo, jwt, role: res.data.role, id: res.data.id };
        dispatch(authSuccess(data));
        dispatch(
          checkAuthTimeout(expirationDate.getTime() - new Date().getTime())
        );
        dispatch(setAuthRedirect())
      }).catch(() => dispatch(logOut()));
    }
  }
};