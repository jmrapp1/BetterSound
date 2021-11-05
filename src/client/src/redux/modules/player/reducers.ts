import {PAUSE, PLAY, RESET, SET_TRACK} from './constants';
import {LOGOUT} from "../user/constants";

const initialState = {
    track: undefined,
    playing: false
};

export const resetPlayer = () => (
    { type: RESET }
);

export const setTrack = track => (
    { type: SET_TRACK, track }
);

export const playAudio = () => (
    { type: PLAY }
);

export const pauseAudio = () => (
    { type: PAUSE }
);

export default {
    player: ( state = initialState, action ) => {
        switch (action.type) {
            case SET_TRACK: {
                return {
                    ...state,
                    track: action.track,
                    playing: true
                }
            }
            case PLAY: {
                if (!state.track) {
                    return state;
                }
                return {
                    ...state,
                    playing: true
                }
            }
            case PAUSE: {
                if (!state.track) {
                    return state;
                }
                return {
                    ...state,
                    playing: false
                }
            }
            case RESET: {
                return {
                    ...initialState
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
