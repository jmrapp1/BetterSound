const EventEmitter = require('events');

const ServerEventEmitter = new EventEmitter();

export function on(event: string, listener) {
    ServerEventEmitter.on(event, listener);
}

export function emit(event: string, ...params) {
    ServerEventEmitter.emit(event, ...params);
}

export function removeListener(event: string, listener) {
    ServerEventEmitter.removeListener(event, listener);
}
