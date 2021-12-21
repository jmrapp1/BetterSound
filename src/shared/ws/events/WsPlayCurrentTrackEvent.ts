import {WsEvent} from "./WsEvent";

export class WsPlayCurrentTrackEvent extends WsEvent {

    static readonly EVENT_TYPE = 'WS.PLAY_CURRENT_TRACK';
    payload: {
        currentTime: number
    }

    constructor(currentTime: number) {
        super(WsPlayCurrentTrackEvent.EVENT_TYPE);
        this.payload = {
            currentTime
        };
    }

}
