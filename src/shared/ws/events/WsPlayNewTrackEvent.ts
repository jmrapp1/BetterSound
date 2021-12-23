import {WsEvent} from "./WsEvent";

export class WsPlayNewTrackEvent extends WsEvent {

    static readonly EVENT_TYPE = 'WS.PLAY_NEW_TRACK';
    payload: {
        url: string;
        track
    }

    constructor(url: string, track) {
        super(WsPlayNewTrackEvent.EVENT_TYPE);
        this.payload = {
            url,
            track
        };
    }

}
