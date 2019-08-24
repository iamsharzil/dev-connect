import AuthActionTypes from './auth.types';
import axios from 'axios';

import { setAlert } from '../alert/alert.actions';

export const register = ({
  name,
  email,
  password,
  passwordConfirm
}) => async dispatch => {
  console.log(name, email, password);

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

    // dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.error.errors;

    console.log(errors);

    if (errors) {
      Object.entries(errors).forEach(([key, error]) =>
        dispatch(setAlert(error.message, 'danger', 5000))
      );
    }

    dispatch({
      type: AuthActionTypes.REGISTER_FAIL
    });
  }
};
