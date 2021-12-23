import {WsEvent} from "./WsEvent";

export class WsDeviceDisconnectedEvent extends WsEvent {

    static readonly EVENT_TYPE = 'WS.DEVICE_DISCONNECTED';
    payload: {
        deviceId: string
    }

    constructor(deviceId: string) {
        super(WsDeviceDisconnectedEvent.EVENT_TYPE);
        this.payload = {
            deviceId
        };
    }

}
