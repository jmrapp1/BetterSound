import {PAUSE, PLAY, RESET, SET_AUDIO, SET_CURRENT_TIME, SET_DURATION, SET_TRACK} from './constants';
import {LOGOUT} from "../user/constants";
import {formatTimeString} from "../../../utils/StringUtils";

const initialState = {
    track: undefined,
    audio: undefined,
    playing: false,
    currentTime: 0,
    currentTimeFormatted: '0:00',
    duration: 0,
    durationFormatted: ''
};

export const resetPlayer = () => (
    { type: RESET }
);

export const setTrack = track => (
    { type: SET_TRACK, track }
);

export const setAudio = audio => (
    { type: SET_AUDIO, audio }
);

export const setCurrentTime = currentTime => (
    { type: SET_CURRENT_TIME, currentTime }
);

export const setDuration = duration => (
    { type: SET_DURATION, duration }
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
            case SET_AUDIO: {
                if (!state.track) {
                    return state;
                }
                return {
                    ...state,
                    audio: action.audio
                }
            }
            case SET_CURRENT_TIME: {
                return {
                    ...state,
                    currentTime: action.currentTime,
                    currentTimeFormatted: formatTimeString(action.currentTime)
                }
            }
            case SET_DURATION: {
                return {
                    ...state,
                    duration: action.duration,
                    durationFormatted: formatTimeString(action.duration)
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
