import { WebSocket } from 'ws';
import {isValidWsEvent} from "../../shared/ws/WsEventManager";
import {WsPlayNewTrackEvent} from "../../shared/ws/events/WsPlayNewTrackEvent";
import {ServerEventEmitter} from "../event/ServerEventEmitter";
import {WsEvent} from "../../shared/ws/events/WsEvent";
import {WsCurrentTimeEvent} from "../../shared/ws/events/WsCurrentTimeEvent";

export class UserSocket {

    socket: WebSocket;
    user;

    constructor(socket, user) {
        socket.userSocket = this;
        this.socket = socket;
        this.user = user;
        this.onMessage = this.onMessage.bind(this);
        this.onPassThroughEvent = this.onPassThroughEvent.bind(this);
        this.destroy = this.destroy.bind(this);

        console.log("Got connection from " + JSON.stringify(user));

        this.socket.on('close', this.destroy);
        this.socket.on("message", (msg: any) => {
            try {
                this.onMessage(JSON.parse(msg));
            } catch (e) {
            }
        });
        this.socket.on("pong", () => (this.socket as any).isAlive = true);

        ServerEventEmitter.on(`${user._id}:${WsPlayNewTrackEvent.EVENT_TYPE}`, this.onPassThroughEvent);
        ServerEventEmitter.on(`${user._id}:${WsCurrentTimeEvent.EVENT_TYPE}`, this.onPassThroughEvent);
    }

    private onMessage(event: WsEvent) {
        if (!isValidWsEvent(event)) {
            return console.log('Bad event: ' + JSON.stringify(event));
        }
        ServerEventEmitter.emit(`${this.user._id}:${event.type}`, event, this);
    }

    private onPassThroughEvent(event: WsPlayNewTrackEvent, userSocket: UserSocket) {
        if (userSocket === this) {
            return;
        }
        this.socket.send(JSON.stringify(event));
    }

    destroy() {
        console.log(`User ${this.user.email} ws disconnected`);
        ServerEventEmitter.removeListener(`${this.user._id}:${WsPlayNewTrackEvent.EVENT_TYPE}`, this.onPassThroughEvent)
        ServerEventEmitter.removeListener(`${this.user._id}:${WsCurrentTimeEvent.EVENT_TYPE}`, this.onPassThroughEvent);
    }

}
