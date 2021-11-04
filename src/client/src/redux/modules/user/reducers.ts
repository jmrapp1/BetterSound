import {LOGIN, SET_USER} from './constants';

const initialState = {
    user: {},
    loggedIn: false
};

export const login = user => (
    { type: LOGIN, user }
);

export const setUser = user => (
    { type: SET_USER, user }
);

export default {
    user: ( state = initialState, action ) => {
        switch (action.type) {
            case LOGIN: {
                return {
                    ...state,
                    user: action.user,
                    loggedIn: true
                }
            }
            case SET_USER: {
                return {
                    ...state,
                    user: action.user
                }
            }
            default:
                return state;
        }
    }
}
