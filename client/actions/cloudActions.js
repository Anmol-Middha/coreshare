import axios from 'axios';
import {SYNC_CLOUD, UPLOAD_FILE, GET_ERRORS} from './types.js';
import store from '../store';

export const syncCloud = (cloud, loginuid, history) => dispatch => {
    const sync_url = '/' + cloud.cloudType;
    axios.post(sync_url, {loginuid: loginuid})
    .then(rslt=>{
        if(cloud.cloudType == "gdrive"){
            cloud.cloudType = "Google Drive";
        }
        else if(cloud.cloudType == 'mbox'){
            cloud.cloudType = "Dropbox";
        }
        dispatch({
            type: SYNC_CLOUD,
            payload: {"type": cloud.cloudType, "data": rslt.data}
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
            payload: store.getState().cloud.files.concat({id: rslt.data.fileid, name: rslt.data.filename}),
        })
    })
    .catch(err => {
        dispatch({
            type: GET_ERRORS,
            payload: err
        })
    });
}

export const shareFile = (file, receiverEmail) => dispatch => {
    axios.post('/gdrive/share/' + file.split(",")[0], {receiverEmail, senderId: store.getState().auth.user._id, filename:file.split(",")[1]})
    .then()
    .catch(err => {
        dispatch({
            type: GET_ERRORS,
            payload: err
        })
    })
}