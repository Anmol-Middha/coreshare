import { SET_CURRENT_USER, USER_LOADING, USER_REGISTERED } from "./../actions/types.js";

const isEmpty = require("is-empty");

const initialState = {
    isAuthenticated: false,
    isRegistered:false,
    user: {},
    loading: false,
};

export default function(state = initialState, action) {
    switch(action.type){
        case SET_CURRENT_USER:
            return{
                ...state,
                isAuthenticated: !isEmpty(action.payload),
                user: action.payload
            };
        case USER_REGISTERED:
            return{
                ...state,
                isRegistered: action.payload
            }
        case USER_LOADING: 
            return {
                ...state,
                loading: true
            };
        default:
            return state;
    }
}