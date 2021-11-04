import {SET_ME} from './constants';
import {LOGOUT} from "../user/constants";

const initialState = {
    me: {},
    loaded: false
};

export const setMe = me => (
    { type: SET_ME, me }
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
