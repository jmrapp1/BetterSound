import {WsPlayNewTrackEvent} from "./events/WsPlayNewTrackEvent";
import {WsCurrentTimeEvent} from "./events/WsCurrentTimeEvent";
import {WsPlayCurrentTrackEvent} from "./events/WsPlayCurrentTrackEvent";
import {WsPauseCurrentTrackEvent} from "./events/WsPauseCurrentTrackEvent";

const VALID_EVENTS = [
    WsPlayNewTrackEvent.EVENT_TYPE,
    WsCurrentTimeEvent.EVENT_TYPE,
    WsPlayCurrentTrackEvent.EVENT_TYPE,
    WsPauseCurrentTrackEvent.EVENT_TYPE,
];

export function isValidWsEvent(event) {
    return event.type && VALID_EVENTS.indexOf(event.type.toUpperCase()) >= 0;
}
