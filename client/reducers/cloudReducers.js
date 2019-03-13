import {SYNC_CLOUD, UPLOAD_FILE} from './../actions/types';

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
                files: state.files.concat(action.payload),
            };
        default: 
            return state;
    }
}

