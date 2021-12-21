
export abstract class WsEvent {

    static readonly EVENT_TYPE: string;
    type: string;
    sentAt: number;
    latency: number;
    audioLatency: number;
    abstract payload: object;

    constructor(eventType) {
        this.type = eventType;
    }

}
