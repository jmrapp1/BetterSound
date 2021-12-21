import {WsEvent} from "./WsEvent";

export class WsPauseCurrentTrackEvent extends WsEvent {

    static readonly EVENT_TYPE = 'WS.PAUSE_CURRENT_TRACK';
    payload: {
        currentTime: number
    }

    constructor(currentTime: number) {
        super(WsPauseCurrentTrackEvent.EVENT_TYPE);
        this.payload = {
            currentTime
        };
    }

}
