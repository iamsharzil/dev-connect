import AuthActionTypes from './auth.types';
import axios from 'axios';

import { setAlert } from '../alert/alert.actions';
import setAuthToken from './auth.utils';

export const loadUser = () => async dispatch => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const res = await axios.get('http://localhost:5000/api/v1/auth');

    dispatch({
      type: AuthActionTypes.USER_LOADED,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: AuthActionTypes.AUTH_ERROR
    });
  }
};

export const register = ({
  name,
  email,
  password,
  passwordConfirm
}) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const body = JSON.stringify({ name, email, password, passwordConfirm });

  try {
    const res = await axios.post(
      'http://localhost:5000/api/v1/auth/signup',
      body,
      config
    );

    dispatch({
      type: AuthActionTypes.REGISTER_SUCCESS,
      payload: res.data
    });

    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.error.errors;

    if (errors) {
      Object.entries(errors).forEach(([key, error]) =>
        dispatch(setAlert(error.message, 'danger', 5000))
      );
    } else {
      dispatch(setAlert(err.response.data.message, 'danger', 5000));
    }

    dispatch({
      type: AuthActionTypes.REGISTER_FAIL
    });
  }
};

export const login = ({ email, password }) => async dispatch => {
  const config = {
    headers: {
      'Content-type': 'application/json'
    }
  };

  const body = JSON.stringify({ email, password });

  try {
    const res = await axios.post(
      'http://localhost:5000/api/v1/auth/login',
      body,
      config
    );

    dispatch({
      type: AuthActionTypes.LOGIN_SUCCESS,
      payload: res.data
    });

    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.error.errors;

    if (errors) {
      Object.entries(errors).forEach(([key, error]) =>
        dispatch(setAlert(error.message, 'danger', 5000))
      );
    } else {
      dispatch(setAlert(err.response.data.message, 'danger', 5000));
    }

    dispatch({
      type: AuthActionTypes.LOGIN_FAIL
    });
  }
};

export const logout = () => dispatch => {
  dispatch({
    type: AuthActionTypes.LOGOUT
  });
};
