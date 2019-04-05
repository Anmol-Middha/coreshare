import {GET_COUNT, LIST_NOTIFICATIONS, IGNORE_NOTIFICATION, GET_ERRORS, ACCEPT_NOTIFICATION} from './types.js';
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

export const ignoreNotification = (notificationId) => dispatch => {
    axios.post('/notifications/ignore', {nfid: notificationId})
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

export const acceptNotification = (notificationId) => dispatch => {
    axios.post('/notifications/accept', {nfid: notificationId});
}