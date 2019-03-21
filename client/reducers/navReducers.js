import {GET_COUNT, LIST_NOTIFICATIONS} from './../actions/types';

const initialState = {
    count: "",
    notifications: []
}

export default function(state = initialState, action){
    switch(action.type){
        case GET_COUNT:
            return{
                ...state,
                count: action.payload
            }
        case LIST_NOTIFICATIONS:
            return{
                ...state,
                notifications: action.payload
            }
        default:
            return state;
    }
}