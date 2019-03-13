import axios from 'axios';
import setAuthToken from './../utils/setAuthToken.js';
import jwt_decode from 'jwt-decode';

import {GET_ERRORS, SET_CURRENT_USER, USER_LOADING, USER_REGISTERED} from "./types.js"

export const registerUser = (userData, history) => dispatch => {
    axios.post("/user/signup", userData)
    .then(res => 
        dispatch({
            type: USER_REGISTERED,
            payload: true
        }),
        )
    .catch(err => 
        dispatch({
        type: GET_ERRORS,
        payload: err,
    })
    );
};

export const loginUser = (userData, history) => dispatch => {
    axios.post('/user/login', userData)
    .then(res=> {
        const token = "Bearer " + res.data.token;
        localStorage.setItem("jwtToken", token);
        setAuthToken(token);
        const decoded = jwt_decode(token);
        dispatch(setCurrentUser(decoded));
    })
    .catch(err => {
        dispatch({
            type: GET_ERRORS,
            payload: err
        })
    });
};

export const setCurrentUser = decoded =>{
    return {
        type: SET_CURRENT_USER,
        payload: decoded
    };
};

export const setUserLoading = () => {
    return{
        type: USER_LOADING
    };
};

export const backToHome = () => dispatch => {
    dispatch({
        type: USER_REGISTERED,
        payload: false
    })
}

export const logoutUser = (history) => dispatch => {
    localStorage.removeItem("jwtToken");
    setAuthToken(false);
    dispatch(setCurrentUser({}));
    // history.push('/');
}