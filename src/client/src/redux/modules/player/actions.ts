import * as Reducer from './reducers';

export function resetPlayer() {
    return dispatch => dispatch(Reducer.resetPlayer());
}

export function setTrack(track) {
    return dispatch => dispatch(Reducer.setTrack(track));
}

export function playAudio(url) {
    return dispatch => dispatch(Reducer.playAudio());
}

export function pauseAudio(url) {
    return dispatch => dispatch(Reducer.pauseAudio());
}
