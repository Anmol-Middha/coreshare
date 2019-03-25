import {GET_COUNT, LIST_NOTIFICATIONS, IGNORE_NOTIFICATION, GET_ERRORS} from './types.js';
import axios from 'axios';
import store from '../store';

export const getCount = () => dispatch => {
    axios.post('/notifications/count', {uid: store.getState().auth.user._id})
    .then(rslt=>{
        dispatch({
            type: GET_COUNT,
            payload: rslt.data  
        })
    })
    .catch(err=>{
        dispatch({
            type: GET_ERRORS,
            payload: err
        })
    });
}

export const listNotifications = () => dispatch => {
    axios.post('/notifications/getall', {uid: store.getState().auth.user._id})
    .then(rslt=>{
        dispatch({
            type: LIST_NOTIFICATIONS,
            payload: rslt.data
        });
    })
    .catch(err=>{
        dispatch({
            type: GET_ERRORS,
            payload: err
        });
    });
}

export const ignoreNotification = (sharedFileId) => dispatch => {
    axios.post('/notifications/ignore', {sfid: sharedFileId})
    .then(() => {
        axios.post('/notifications/count', {uid: store.getState().auth.user._id})
        .then(rslt=>{
            dispatch({
                type: GET_COUNT,
                payload: rslt.data  
            });
        });
        axios.post('/notifications/getall', {uid: store.getState().auth.user._id})
        .then(rslt=>{
            dispatch({
                type: LIST_NOTIFICATIONS,
                payload: rslt.data
            });
        });
    })
    .catch(err => {
        dispatch({
            type: GET_ERRORS,
            payload: err
        })
    })
}