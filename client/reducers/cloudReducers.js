import {SYNC_CLOUD, UPLOAD_FILE, SHARE_FILE} from './../actions/types';

const initialState = {
    files: []
};

export default function(state=initialState, action){
    switch(action.type){
        case SYNC_CLOUD:
            return{
                ...state,
                files: action.payload
            };
        case UPLOAD_FILE: 
            return{
                ...state,
                files: action.payload,
            };
        default: 
            return state;
    }
}

