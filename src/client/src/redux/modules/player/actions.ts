import * as Reducer from './reducers';

export function resetPlayer() {
    return dispatch => dispatch(Reducer.resetPlayer());
}

export function setTrack(track) {
    return dispatch => dispatch(Reducer.setTrack(track));
}

export function setCurrentTime(currentTime: number) {
    return dispatch => dispatch(Reducer.setCurrentTime(currentTime));
}

export function setDuration(duration: number) {
    return dispatch => dispatch(Reducer.setDuration(duration));
}

export function setAudio(audio: HTMLAudioElement) {
    return dispatch => dispatch(Reducer.setAudio(audio));
}

export function playAudio() {
    return dispatch => dispatch(Reducer.playAudio());
}

export function pauseAudio() {
    return dispatch => dispatch(Reducer.pauseAudio());
}
