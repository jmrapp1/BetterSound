
function generateId() {
    return Math.random().toString(36).substring(2) +
        (new Date()).getTime().toString(36);
}

export function getDeviceCustomName() {
    let deviceName = localStorage.getItem("device_name");
    if (!deviceName) {
        deviceName = getDeviceId();
        localStorage.setItem("device_name", deviceName);
    }
    return deviceName;
}

export function setDeviceCustomName(name: string) {
    localStorage.setItem("device_name", name);
}

export function getDeviceId() {
    let deviceId = localStorage.getItem("device_id");
    if (!deviceId) {
        deviceId = generateId();
        localStorage.setItem("device_id", deviceId);
    }
    return deviceId;
}

