import {SYNC_CLOUD, UPLOAD_FILE, SHARE_FILE} from './../actions/types';

const initialState = {
    type: "",
    files: []
};

export default function(state=initialState, action){
    switch(action.type){
        case SYNC_CLOUD:
            return{
                ...state,
                type: action.payload.type,
                files: action.payload.data
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

