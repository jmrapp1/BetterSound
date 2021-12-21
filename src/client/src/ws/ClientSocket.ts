import {isValidWsEvent} from "../../../shared/ws/WsEventManager";
import {WsEvent} from "../../../shared/ws/events/WsEvent";
import {getLocalStorageAuthToken} from "../redux/utils/fetchUtils";

export class ClientSocketOptions {
    onOpen?: () => void;
    onEvent?: (event: WsEvent) => void;
    onClose?: (e) => void;
    onError?: (e) => void;
}

export class ClientSocket {

    private socket: WebSocket;
    private customOnMessage: (event: WsEvent) => void;
    private customOnOpen: () => void;
    private customOnClose: (e) => void;
    private customOnError: (e) => void;
    private connectInterval;
    private timeout;

    constructor(options: ClientSocketOptions) {
        this.customOnMessage = options.onOpen;
        this.customOnMessage = options.onEvent;
        this.customOnClose = options.onClose;
        this.customOnError = options.onError;

        this.onOpen = this.onOpen.bind(this);
        this.onMessage = this.onMessage.bind(this);
        this.onClose = this.onClose.bind(this);
        this.onError = this.onError.bind(this);
    }

    connect() {
        this.socket = new WebSocket("ws://192.168.1.158:3000/ws?auth=" + getLocalStorageAuthToken(), null);
        this.socket.onopen = this.onOpen;
        this.socket.onmessage = this.onMessage;
        this.socket.onclose = this.onClose;
        this.socket.onerror = this.onError;
    }

    close() {
        if (this.socket) {
            this.socket.close();
        }
    }

    sendEvent(event: WsEvent) {
        event.sentAt = Date.now();
        console.log('Sending event' + JSON.stringify(event));
        this.socket.send(JSON.stringify(event));
    }

    private onOpen() {
        console.log("Connected to websocket server");
        if (this.customOnOpen) this.customOnOpen();

        this.timeout = 1000;
        if (this.connectInterval) {
            clearTimeout(this.connectInterval);
        }
    }

    private onMessage(msg) {
        try {
            const parsedEvent = JSON.parse(msg.data);
            if (isValidWsEvent(parsedEvent)) {
                parsedEvent.latency = Date.now() - parsedEvent.sentAt;
                parsedEvent.audioLatency = parsedEvent.latency > 0 // if devices are behind in time latency will be off
                    ? parsedEvent.latency / 10000 // add latency to time
                    : 0
                console.log(`Event ${parsedEvent.type} received. Latency of ${parsedEvent.latency} ${parsedEvent.audioLatency}`);
                if (this.customOnMessage) this.customOnMessage(parsedEvent);
            }
        } catch (e) {
        }
    }

    private onClose(e) {
        console.log("Disconnected from websocket server. Attempting to reconnect. Code ", e.code);
        if (this.customOnClose) this.customOnClose(e);
        this.timeout = this.timeout + this.timeout;
        this.connectInterval = setTimeout(() => {
            if (this.socket.readyState == WebSocket.CLOSED) {
                this.connect();
            }
        }, Math.min(10000, this.timeout)); //call check function after timeout
    }

    private onError(e) {
        console.error("WebSocket encountered error. Closing. Message2: ", e.message);
        this.socket.close();
        if (this.customOnError) this.customOnError(e);
    }

}
