import { WebSocket } from 'ws';
import {isValidWsEvent} from "../../shared/ws/WsEventManager";
import {WsPlayNewTrackEvent} from "../../shared/ws/events/WsPlayNewTrackEvent";
import * as ServerEventEmitter from "../event/ServerEventEmitter";
import {WsEvent} from "../../shared/ws/events/WsEvent";
import {WsCurrentTimeEvent} from "../../shared/ws/events/WsCurrentTimeEvent";
import {WsPlayCurrentTrackEvent} from "../../shared/ws/events/WsPlayCurrentTrackEvent";
import {WsPauseCurrentTrackEvent} from "../../shared/ws/events/WsPauseCurrentTrackEvent";
import {WsDeviceConnectedEvent} from "../../shared/ws/events/WsDeviceConnectedEvent";
import {WsDeviceDisconnectedEvent} from "../../shared/ws/events/WsDeviceDisconnectedEvent";
import {WsStatusRequestEvent} from "../../shared/ws/events/WsStatusRequestEvent";
import {WsStatusUpdateEvent} from "../../shared/ws/events/WsStatusUpdateEvent";

export class UserSocket {

    socket: WebSocket;
    user;
    deviceId: string;

    constructor(socket, user, deviceId: string) {
        socket.userSocket = this;
        this.socket = socket;
        this.user = user;
        this.deviceId = deviceId;
        this.onMessage = this.onMessage.bind(this);
        this.onPassThroughEvent = this.onPassThroughEvent.bind(this);;
        this.onStatusUpdateEvent = this.onStatusUpdateEvent.bind(this);
        this.destroy = this.destroy.bind(this);

        console.log("Got connection from " + user.email + " (" + this.deviceId + ")");

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
        ServerEventEmitter.on(`${user._id}:${WsPlayCurrentTrackEvent.EVENT_TYPE}`, this.onPassThroughEvent);
        ServerEventEmitter.on(`${user._id}:${WsPauseCurrentTrackEvent.EVENT_TYPE}`, this.onPassThroughEvent);
        ServerEventEmitter.on(`${user._id}:${WsDeviceConnectedEvent.EVENT_TYPE}`, this.onPassThroughEvent);
        ServerEventEmitter.on(`${user._id}:${WsDeviceDisconnectedEvent.EVENT_TYPE}`, this.onPassThroughEvent);
        ServerEventEmitter.on(`${user._id}:${WsStatusRequestEvent.EVENT_TYPE}`, this.onPassThroughEvent);
        ServerEventEmitter.on(`${user._id}:${WsStatusUpdateEvent.EVENT_TYPE}`, this.onStatusUpdateEvent);

        ServerEventEmitter.emit(`${user._id}:${WsStatusRequestEvent.EVENT_TYPE}`, new WsStatusRequestEvent(this.deviceId));
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

    private onStatusUpdateEvent(event: WsStatusUpdateEvent, userSocket: UserSocket) {
        if (userSocket === this) {
            return;
        } else if (!isValidWsEvent(event)) {
            return console.log('Bad event: ' + JSON.stringify(event));
        }
        if (event.payload.reqDeviceId === this.deviceId) {
            this.socket.send(JSON.stringify(event));
        }
    }

    destroy() {
        console.log(`User ${this.user.email} (${this.deviceId}) ws disconnected`);
        ServerEventEmitter.emit(`${this.user._id}:${WsStatusRequestEvent.EVENT_TYPE}`, new WsDeviceDisconnectedEvent(this.deviceId));

        ServerEventEmitter.removeListener(`${this.user._id}:${WsPlayNewTrackEvent.EVENT_TYPE}`, this.onPassThroughEvent)
        ServerEventEmitter.removeListener(`${this.user._id}:${WsCurrentTimeEvent.EVENT_TYPE}`, this.onPassThroughEvent);
        ServerEventEmitter.removeListener(`${this.user._id}:${WsPlayCurrentTrackEvent.EVENT_TYPE}`, this.onPassThroughEvent);
        ServerEventEmitter.removeListener(`${this.user._id}:${WsPauseCurrentTrackEvent.EVENT_TYPE}`, this.onPassThroughEvent);
        ServerEventEmitter.removeListener(`${this.user._id}:${WsDeviceConnectedEvent.EVENT_TYPE}`, this.onPassThroughEvent);
        ServerEventEmitter.removeListener(`${this.user._id}:${WsDeviceDisconnectedEvent.EVENT_TYPE}`, this.onPassThroughEvent);
        ServerEventEmitter.removeListener(`${this.user._id}:${WsStatusRequestEvent.EVENT_TYPE}`, this.onPassThroughEvent);
        ServerEventEmitter.removeListener(`${this.user._id}:${WsStatusUpdateEvent.EVENT_TYPE}`, this.onStatusUpdateEvent);
    }

}
