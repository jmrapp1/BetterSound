import {triggerEvent} from "./Eventing";

export const EVENT_TRACK_PLAY_TRACK = 'EVENT.TRACK_PLAY_TRACK';
export const EVENT_TRACK_PLAY_PAUSED = 'EVENT.TRACK_PLAY_PAUSED';
export const EVENT_TRACK_SEEKED = 'EVENT.TRACK_SEEKED';
export const EVENT_TRACK_VOLUME = 'EVENT.TRACK_VOLUME';

export function triggerEventPlayPauseTrack() {
    triggerEvent(EVENT_TRACK_PLAY_PAUSED);
}

export function triggerEventSeekTrack(time: number) {
    triggerEvent(EVENT_TRACK_SEEKED, { time });
}

export function triggerEventPlayTrack(track) {
    triggerEvent(EVENT_TRACK_PLAY_TRACK, { track });
}

export function triggerEventTrackVolume(volume: number) {
    triggerEvent(EVENT_TRACK_VOLUME, { volume });
}
