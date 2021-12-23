import {WsEvent} from "./WsEvent";

export class WsStatusRequestEvent extends WsEvent {

    static readonly EVENT_TYPE = 'WS.STATUS_REQUEST';
    payload: {
        reqDeviceId: string
    }

    constructor(reqDeviceId: string) {
        super(WsStatusRequestEvent.EVENT_TYPE);
        this.payload = {
            reqDeviceId
        };
    }

}
