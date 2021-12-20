
export function addEventListener(eventType: string, eventListener) {
    document.addEventListener(eventType, eventListener);
}

export function removeEventListener(eventType: string, eventListener) {
    document.removeEventListener(eventType, eventListener);
}

export function onceEventListener(eventType: string, listener) {
    addEventListener(eventType, handleEventOnce);
    function handleEventOnce(event) {
        listener(event);
        removeEventListener(eventType, handleEventOnce);
    }
}

export function triggerEvent(eventType: string, data = {}) {
    const event = new CustomEvent(eventType, { detail: data });
    document.dispatchEvent(event);
}
