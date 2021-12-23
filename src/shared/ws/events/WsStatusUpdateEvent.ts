import {WsEvent} from "./WsEvent";

export class WsStatusUpdateEvent extends WsEvent {

    static readonly EVENT_TYPE = 'WS.STATUS_UPDATE';
    payload: {
        reqDeviceId: string,
        deviceId: string,
        isOwningPlayer: boolean,
        track?
        url?: string,
        currentTime?: number,
        isPlaying?: boolean
    }

    constructor(reqDeviceId: string, deviceId: string, isOwningPlayer: boolean, track?, url?: string, currentTime?: number, isPlaying?: boolean) {
        super(WsStatusUpdateEvent.EVENT_TYPE);
        this.payload = {
            reqDeviceId,
            deviceId,
            isOwningPlayer,
            currentTime,
            url,
            track,
            isPlaying
        };
    }

}
