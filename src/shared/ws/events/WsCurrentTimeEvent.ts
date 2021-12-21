import {WsEvent} from "./WsEvent";

export class WsCurrentTimeEvent extends WsEvent {

    static readonly EVENT_TYPE = 'WS.CURRENT_TIME';
    payload: {
        currentTime: number;
    }

    constructor(currentTime: number) {
        super(WsCurrentTimeEvent.EVENT_TYPE);
        this.payload = {
            currentTime
        };
    }

}
