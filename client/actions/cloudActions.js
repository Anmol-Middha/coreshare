import axios from 'axios';
import {SYNC_CLOUD, UPLOAD_FILE, GET_ERRORS} from './types.js';

export const syncCloud = (cloud, history) => dispatch => {
    const url = '/' + cloud.cloudType;
    axios.post(url)
    .then(rslt=>{
        dispatch({
            type: SYNC_CLOUD,
            payload: rslt.data
        });
        history.push('/dashboard/gdrive');
    })
    .catch(err => {
        dispatch({
            type: GET_ERRORS,
            payload: err
        }) 
    });
}

export const uploadFile = (file) => dispatch => {
    axios.post('/gdrive/upload', file)
    .then(rslt => {
        dispatch({
            type: UPLOAD_FILE,
            payload: {id: rslt.data.fileid, name: rslt.data.filename}
        })
    })
    .catch(err => {
        dispatch({
            type: GET_ERRORS,
            payload: err
        })
    });
}