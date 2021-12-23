import {WsEvent} from "./WsEvent";

export class WsDeviceConnectedEvent extends WsEvent {

    static readonly EVENT_TYPE = 'WS.DEVICE_CONNECTED';
    payload: {
        deviceId: string,
        deviceName: string
    }

    constructor(deviceId: string, deviceName: string) {
        super(WsDeviceConnectedEvent.EVENT_TYPE);
        this.payload = {
            deviceId,
            deviceName
        };
    }

}
