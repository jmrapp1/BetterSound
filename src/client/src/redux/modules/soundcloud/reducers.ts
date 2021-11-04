import {SET_HISTORY, SET_ME} from './constants';
import {LOGOUT} from "../user/constants";

const initialState = {
    me: {},
    history: [],
    loaded: false
};

export const setMe = me => (
    { type: SET_ME, me }
);

export const setHistory = history => (
    { type: SET_HISTORY, history }
);

export default {
    sc: ( state = initialState, action ) => {
        switch (action.type) {
            case SET_ME: {
                return {
                    ...state,
                    me: action.me,
                    loaded: true
                }
            }
            case SET_HISTORY: {
                return {
                    ...state,
                    history: action.history
                }
            }
            case LOGOUT: {
                return {
                    ...initialState
                }
            }
            default:
                return state;
        }
    }
}
